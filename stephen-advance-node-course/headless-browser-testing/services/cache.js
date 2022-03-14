const mongoose = require('mongoose');
const redis = require('redis');

const connectToRedis = async () => {
  const redisUrl = 'redis://127.0.0.1:6379';
  const client = redis.createClient({ url: redisUrl });
  await client.connect();

  return client;
};

// Any time query is executed (using await) this exec function execute it
const exec = mongoose.Query.prototype.exec;

// We have done this because we want to make the cache function chain-able, it can be used before or after any other query methods of mongoose
mongoose.Query.prototype.cache = function (options = {}) {
  // options can have optional "key" property
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key) || 'default';

  return this;
};

mongoose.Query.prototype.exec = async function () {
  // Here "this" is current query
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign(
      {},
      {
        query: this.getQuery(),
        collection: this.mongooseCollection.name,
        queryOptions: this.getOptions(),
      }
    )
  );

  // 1) See if we have a value for "key" in redis DB
  const client = await connectToRedis();
  const cachedValue = await client.hGet(this.hashKey, key);

  // 2) If we do, return that
  if (cachedValue) {
    console.log('[FROM CACHED VALUE]');

    // These doc (docs) are instance of Model documents, there are methods tied to it, so we are adding these as stringified to the redis
    const doc = JSON.parse(cachedValue);

    // Create the mongoose documents out of the parsed cachedValue, if they are multiple documents, then loop them and create the documents from the respective models (that comes from query.model "this.mode")

    // "exec" function expects to be returned a document or array of documents
    return Array.isArray(doc)
      ? // Here doc are multiple documents
        doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  // 3) Otherwise, issue the query and store the results in redis

  // Run the original exec function and set the value of exec "this" to "this" of current function
  // "Issue the query"
  const results = await exec.apply(this, arguments);

  // EXpires after 10 seconds
  client.hSet(this.hashKey, key, JSON.stringify(results));
  // Expire this hashKey "hash" after 10 seconds
  client.expire(this.hashKey, 10);

  // "exec" function expects to be returned a document or array of documents
  return results;
};

module.exports = {
  // topLevelKey is the same as "options.key"
  async clearHash(topLevelKey) {
    const client = await connectToRedis();

    // Make sure to stringify it, sometimes the key can be array or object
    client.del(JSON.stringify(topLevelKey));
  },
};
