const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  // graphql will execute this function, after this file has been executed, so all the variables will be in the closure scope of this function
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        // here parentValue is "company"
        return axiosInstance
          .get(`/companies/${parentValue.id}/users`)
          .then(res => res.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  // this has two required props, name, fields
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        // our raw data has "companyId", but we are specifying here is "company", we need to tell the graphql, that "companyId's" data is company

        // parentValue is that is currently fetched
        const { companyId } = parentValue;

        return axiosInstance
          .get(`/companies/${companyId}`)
          .then(res => res.data);
      },
    },
  }),
});

// allow graphql to jump and land on a very specific node in the graph of all of our data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        // You are trying to find the user with someId
        // In Resolve function, we actually go to db, and grab our data
        // "args" obj is present from the previous "user" value

        // if promise is returned, graphql will automatically resolve it
        return axiosInstance.get(`/users/${args.id}`).then(res => res.data);

        // we specifically don't need to send specific type, we can return raw js obj, and graphql will convert it into some type
      },
    },

    // another rootQuery
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        // args will have id property, from the args above
        return axiosInstance.get(`/companies/${args.id}`).then(res => res.data);
      },
    },
  }),
});

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      // this is what we will be returning from "resolve" function
      type: UserType,
      args: {
        // this values should be non null, these values must be provided
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        // "companyId" is optional
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, age }) {
        return axiosInstance
          .post('/users', { firstName, age })
          .then(res => res.data);
      },
    },
    deleteUser: {
      // this type will be returned
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, { id }) {
        return axiosInstance.delete(`/users/${id}`).then(res => res.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axiosInstance
          .patch(`/users/${args.id}`, args)
          .then(res => res.data);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: rootMutation,
});

module.exports = schema;
