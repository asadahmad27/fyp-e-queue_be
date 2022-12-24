import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import {
  user,
  users
} from '../queries/user-queries.js';
import {
  register,
  login,
  updateUser
} from '../mutations/user-mutations.js';

//  * QUERIES
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //  * USERS QUERIE
    user,
    users

  },
});

//  * MUTATUION
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // * USER MUTATIONS
    // ? REGISTER USER
    register,
    // ? LOGIN USER
    login,
    // ? PROFILE UPDATE
    updateUser

  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
