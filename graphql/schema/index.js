import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import {
  user,
  users,
  allEmploys,
  allCustomers
} from '../queries/user-queries.js';
import { allCategory, category } from "../queries/category-queries.js"

import { allAdListForAdmin, adList, allAdList, adListOnCatelog, AdsByCategory } from "../queries/ad-list-queires.js"
import {
  register,
  login,
  updateUser,
  deleteUser,
  changePassword,
  imageTest,
  updateAddress,
  empRegister,
  empLogin,
  addAdmin,
  updateAdmin,
  updateAdminEmail,
  deleteEmp
} from '../mutations/user-mutations.js';
import { createTicket, updateTicket } from "../mutations/ticket-mutation.js"
import { allWindow, window } from "../queries/window-queries.js"
import { allOrg, organization } from "../queries/org-queries.js"
import { allTickets } from "../queries/ticket-queries.js"
import {
  addWindow,
  updateWindow,
  deleteWindow
} from "../mutations/window-mutation.js"
import { addOrg, updateOrg, deleteOrg } from "../mutations/org-mutation.js"
import { addCategory, updateCategory, deleteCategory } from "../mutations/category-mutation.js"
import { addSubCategory, updateSubCategory, deleteSubCategory } from "../mutations/sub-category-mutation.js"
import { createAdList, updateAdList, deleteAdList, updateAdListStatus } from "../mutations/ad-list-mutation.js"
import { allSubCategory, allSubCategoryByCategoryID } from "../queries/sub-category-queries.js";

//  * QUERIES
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //  * USERS QUERIE
    user,
    users,
    allEmploys,
    allCustomers,

    //  * WINDOW QUERIE
    allWindow,
    window,

    // ORG QRIES
    allOrg,
    organization,

    // tickets
    allTickets,
    //  * CATEGORY QUERIE
    allCategory,
    category,
    allSubCategory,
    allSubCategoryByCategoryID,


    //  *ALL AD LIST FRO ADMIN
    allAdListForAdmin,
    allAdList,
    adList,
    adListOnCatelog,
    AdsByCategory


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
    // EMPLOYEE REGISTER
    empRegister,
    addAdmin,
    updateAdmin,
    updateAdminEmail,
    // // EMPLOYEE LOGIN 
    empLogin,
    deleteEmp,
    updateUser,
    //  ? USER DELETE
    deleteUser,
    // ADD WINDOW
    addWindow,
    updateWindow,
    deleteWindow,
    imageTest,

    // TOKEN
    createTicket,
    updateTicket,
    // ADD ORG
    addOrg,
    // UPDATE ORG
    updateOrg,
    // DELETE ORG
    deleteOrg,
    //  ? UPDATE PASSWORD
    updateAddress,

    //  ? PASSWORD CHANGE
    changePassword,

    // ? CATEGORY CREATE
    addCategory,
    //  ? CATEGORY UPDATE
    updateCategory,
    //  ? DELETE CATEGORY
    deleteCategory,

    //? SUB CATEGORY CREATE
    addSubCategory,
    // ? SUB CATEGORY UPDATE
    updateSubCategory,
    //? DELETE SUB CATEGORY
    deleteSubCategory,

    //  AD LIST CREATE
    createAdList,
    //  ?Ad List UPDATE
    updateAdList,
    //  ? ad list delete
    deleteAdList,
    //  ? ad list status update
    updateAdListStatus




  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
