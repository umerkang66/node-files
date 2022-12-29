const { GraphQLObjectType, GraphQLString } = require('graphql');

const { signup, login } = require('../services/auth');
const UserType = require('./types/user_type');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      // returnType from resolve
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parentValue, { email, password }, req) {
        return signup({ email, password, req });
      },
    },
    logout: {
      type: UserType,
      resolve(parentValue, _, req) {
        const user = req.user;
        req.logout();
        return user;
      },
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parentValue, { email, password }, req) {
        return login({ email, password, req });
      },
    },
  },
});

module.exports = mutation;
