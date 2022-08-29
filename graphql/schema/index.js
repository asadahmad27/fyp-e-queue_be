import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { users, user, usersCount } from '../queries/user-queries.js';
import {
  register,
  login,
  emailConfirmation,
  resetPassword,
  updateUser,
} from '../mutations/user-mutations.js';

//  * QUERIES
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //  * USERS QUERIES
    users,
    user,
    usersCount,
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
    // ? EMAIL CONFIRMATION
    emailConfirmation,
    // ? RESET PASSWORD
    resetPassword,
    // ? UPDATE USER
    updateUser,
    // * USER MUTATIONS
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
