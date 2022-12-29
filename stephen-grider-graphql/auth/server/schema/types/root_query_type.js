const { GraphQLObjectType, GraphQLID } = require('graphql');
const UserType = require('./user_type');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    currentUser: {
      type: UserType,
      resolve(parentValue, args, req) {
        // if the user is not signed in, this will be null
        return req.user;
      },
    },
  },
});

module.exports = RootQueryType;
