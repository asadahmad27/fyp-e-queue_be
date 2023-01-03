import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import {
  user,
  users
} from '../queries/user-queries.js';
import { allCategory, category } from "../queries/category-queries.js"
import { allSubCategory, subCategory } from "../queries/sub-category-queries.js"
import { allSubCategoryDetails } from "../queries/sub-category-details-queires.js"
import { allAdListForAdmin, adList } from "../queries/ad-list-queires.js"
import {
  register,
  login,
  updateUser,
  deleteUser,
  changePassword
} from '../mutations/user-mutations.js';

import { addCategory, updateCategory, deleteCategory } from "../mutations/category-mutation.js"
import { addSubCategory, updateSubCategory, deleteSubCategory } from "../mutations/sub-category-mutation.js"
import { createSubCategoryDetails, updateSubCategoryDetails, deleteSubCategoryDetails } from "../mutations/sub-category-details-mutation.js"
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

    //  * SUB CATEGORY QURIE
    allSubCategory,
    subCategory,

    //  * SUB CATEGORY DETAILS
    allSubCategoryDetails,

    //  *ALL AD LIST FRO ADMIN
    allAdListForAdmin,
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
    //  ? PASSWORD CHANGE
    changePassword,

    // ? CATEGORY CREATE
    addCategory,
    //  ? CATEGORY UPDATE
    updateCategory,
    //  ? DELETE CATEGORY
    deleteCategory,

    //  ? SUB CATEGORY CREATE
    addSubCategory,
    //  ? SUB CATEGORY UPDATE
    updateSubCategory,
    //  ? SUB CATEGORY DELETE
    deleteSubCategory,

    //  ? SUB CATEGORY DETAILS CREATE
    createSubCategoryDetails,
    //  ?SUB CATEGORY DETAILS UPDATE
    updateSubCategoryDetails,
    //  ?SUB CATEGORY DETAILS DLEETE
    deleteSubCategoryDetails,

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
