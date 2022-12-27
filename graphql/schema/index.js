import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import {
  user,
  users
} from '../queries/user-queries.js';
import { allCategory, category } from "../queries/category-queries.js"
import {
  register,
  login,
  updateUser
} from '../mutations/user-mutations.js';

import { createCategory, updateCategory, deleteCategory } from "../mutations/category-mutation.js"

//  * QUERIES
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //  * USERS QUERIE
    user,
    users,

    //  * CATEGORY QUERIE
    allCategory,
    category

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
    updateUser,

    // ? CATEGORY CREATE
    createCategory,
    //  ? CATEGORY UPDATE
    updateCategory,
    //  ? DELETE CATEGORY
    deleteCategory

  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
