import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import {
  user,
  users,
  allEmploys,
  allCustomers
} from '../queries/user-queries.js';

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
  deleteWindow,
  updateServingStatus
} from "../mutations/window-mutation.js"
import { addOrg, updateOrg, deleteOrg } from "../mutations/org-mutation.js"

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
    updateServingStatus,
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



  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
