const deleteFromRedis = async () => {
  const redis = require('redis');

  const redisUrl = 'redis://localhost:6379';
  const client = redis.createClient({ url: redisUrl });

  await client.connect();
  await client.flushAll();
};

module.exports = deleteFromRedis;
