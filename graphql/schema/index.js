import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import {
  user,
  users
} from '../queries/user-queries.js';
import { allCategory, category } from "../queries/category-queries.js"

import { allAdListForAdmin, adList, allAdList } from "../queries/ad-list-queires.js"
import {
  register,
  login,
  updateUser,
  deleteUser,
  changePassword,
  imageTest
} from '../mutations/user-mutations.js';
import { addCategory, updateCategory, deleteCategory } from "../mutations/category-mutation.js"
import { createAdList, updateAdList, deleteteAdList } from "../mutations/ad-list-mutation.js"

//  * QUERIES
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //  * USERS QUERIE
    user,
    users,

    //  * CATEGORY QUERIE
    allCategory,
    category,

    //  *ALL AD LIST FRO ADMIN
    allAdListForAdmin,
    allAdList,
    adList


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
    //  ? USER DELETE
    deleteUser,
    imageTest,
    //  ? PASSWORD CHANGE
    changePassword,

    // ? CATEGORY CREATE
    addCategory,
    //  ? CATEGORY UPDATE
    updateCategory,
    //  ? DELETE CATEGORY
    deleteCategory,

    //  AD LIST CREATE
    createAdList,
    //  ?Ad List UPDATE
    updateAdList,
    //  ? ad list delete
    deleteteAdList




  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
