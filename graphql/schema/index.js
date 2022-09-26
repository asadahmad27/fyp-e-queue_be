import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import {
  users,
  user,
  usersCount,
  userForAdmin,
} from '../queries/user-queries.js';
import { faqs, faqsCount } from '../queries/faq-queries.js';
import { privacyPolicy } from '../queries/privacy-policy-queries.js';
import { termsConditions } from '../queries/terms-conditions-queries.js';
import {
  brands,
  brand,
  brandsCount,
  recentBrands,
  brandForAdmin,
} from '../queries/brand-queries.js';
import {
  products,
  product,
  productsCount,
  productsBySearch,
  recentProducts,
  productForAdmin,
} from '../queries/product-queries.js';
import {
  reviews,
  review,
  reviewsCount,
  recentBrandReviews,
  recentProductReviews,
} from '../queries/review-queries.js';
import {
  register,
  login,
  emailConfirmation,
  resetPassword,
  updateUser,
  deleteUser,
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
import {
  createBrandReview,
  updateBrandReview,
  deleteReview,
  updateReviewStatus,
  updateProductReview,
  createProductReview,
} from '../mutations/review-mutations.js';
import {
  createFeed,
  updateFeed,
  deleteFeed,
} from '../mutations/feed-mutations.js';

//  * QUERIES
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //  * USERS QUERIES
    users,
    user,
    usersCount,
    userForAdmin,
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
    brandsCount,
    recentBrands,
    brandForAdmin,
    //  * PRODUCT QUERIES
    products,
    product,
    productsCount,
    productsBySearch,
    recentProducts,
    productForAdmin,
    // * REVIEWS QUERIES
    reviews,
    review,
    reviewsCount,
    recentBrandReviews,
    recentProductReviews,
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
    //? DELETE USER
    deleteUser,
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

    //  * BRAND REVIEW MUTATIONS
    //  ? CREATE BRAND REVIEW
    createBrandReview,
    //  ? CREATE PRODUCT REVIEW
    createProductReview,
    //  ? UPDATE BRAND REVIEW
    updateBrandReview,
    //  ? UPDATE PRODUCT REVIEW
    updateProductReview,

    //  ? DELETE  REVIEW
    deleteReview,
    //  ? ? UPDATE REVIEW STATUS
    updateReviewStatus,
    //  * BRAND REVIEW MUTATIONS

    //  * FEED MUTATIONS
    createFeed,
    updateFeed,
    deleteFeed,
    //  * FEED MUTATIONS
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
