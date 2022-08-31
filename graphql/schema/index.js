import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { users, user, usersCount } from '../queries/user-queries.js';
import { faqs, faqsCount } from '../queries/faq-queries.js';
import { privacyPolicy } from '../queries/privacy-policy-queries.js';
import { termsConditions } from '../queries/terms-conditions-queries.js';
import {
  brands,
  brand,
  brandByUserID,
  brandsCount,
} from '../queries/brand-queries.js';
import {
  products,
  product,
  productByUserID,
  productsCount,
} from '../queries/product-queries.js';
import {
  register,
  login,
  emailConfirmation,
  resetPassword,
  updateUser,
} from '../mutations/user-mutations.js';
import {
  updateFaqs,
  createFaq,
  deleteFaq,
} from '../mutations/faq-mutations.js';
import { createPrivacyPolicy } from '../mutations/privacy-policy-mutations.js';
import { createTermsConditions } from '../mutations/terms-conditions-mutations.js';
import {
  createBrand,
  updateBrand,
  deleteBrand,
} from '../mutations/brand-mutations.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../mutations/product-mutations.js';

//  * QUERIES
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //  * USERS QUERIES
    users,
    user,
    usersCount,
    //  * FAQS QUERIES
    faqs,
    faqsCount,
    //  * PRIVACY POLICY QUERIES
    privacyPolicy,
    //  * TERMS AND CONDITIONS QUERIES
    termsConditions,
    //  * BRAND QUERIES
    brands,
    brand,
    brandByUserID,
    brandsCount,
    //  * PRODUCT QUERIES
    products,
    product,
    productByUserID,
    productsCount,
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

    //  * FAQS MUTATIONS
    // ? CREATE FAQ
    createFaq,
    // ? UPDATE FAQS
    updateFaqs,
    // ? DELETE FAQ
    deleteFaq,
    //  * FAQS MUTATIONS

    //  * PRIVACY POLIICY MUTATIONS
    //  ? CREATE & UPDATE PRIVACY POLICY
    createPrivacyPolicy,
    //  * PRIVACY POLIICY MUTATIONS

    //  * TERMS AND CONDITIONS MUTATIONS
    //  ? CREATE & UPDATE TERMS AND CONDITIONS
    createTermsConditions,
    //  * TERMS AND CONDITIONS MUTATIONS

    //  * BRAND MUTATIONS
    //  ? CREATE BRAND
    createBrand,
    // ? UPDATE BRAND
    updateBrand,
    // ? DELETE BRAND
    deleteBrand,
    //  * BRAND MUTATIONS

    //  * PRODUCT MUTATIONS
    //  ? CREATE PRODUCT
    createProduct,
    // ? UPDATE PRODUCT
    updateProduct,
    // ? DELETE PRODUCT
    deleteProduct,
    //  * PRODUCT MUTATIONS
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
