const { GraphQLObjectType, GraphQLString } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    email: { type: GraphQLString },
  },
});

module.exports = UserType;
