import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import Brand from '../../models/brand.js';
import Product from '../../models/product.js';
import ProductTypes from '../types/product-types.js';
import BrandTypes from '../types/brand-types.js';
import pkg from 'graphql-iso-date';
import UserTypes from './user-types.js';
import User from '../../models/user.js';

const { GraphQLDateTime } = pkg;

// * REVIEW TYPE
const ReviewTypes = new GraphQLObjectType({
  name: 'Review',
  fields: () => ({
    id: { type: GraphQLID },
    rating: { type: GraphQLInt },
    aesthetics: { type: GraphQLInt },
    customer_service: { type: GraphQLInt },
    reputation: { type: GraphQLInt },
    sustainability: { type: GraphQLInt },
    appearance: { type: GraphQLInt },
    nutritional_value: { type: GraphQLInt },
    packaging: { type: GraphQLInt },
    taste: { type: GraphQLInt },
    message: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    brand_id: { type: GraphQLID },
    product_id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    status: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    faqs: { type: new GraphQLList(FaqsTypes) },

    brand: {
      type: new GraphQLList(BrandTypes),
      resolve(parent, args) {
        return Brand.find({ _id: parent.brand_id });
      },
    },
    product: {
      type: new GraphQLList(ProductTypes),
      resolve(parent, args) {
        return Product.find({ _id: parent.product_id });
      },
    },
    user: {
      type: UserTypes,
      resolve(parent, args) {
        return User.findById(parent.user_id);
      },
    },
  }),
});

export const FaqsTypes = new GraphQLObjectType({
  name: 'FaqsReviews',
  fields: () => ({
    question: { type: GraphQLString },
    answer: { type: GraphQLString },
  }),
});

export default ReviewTypes;
