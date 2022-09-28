import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import Brand from '../../models/brand.js';
import User from '../../models/user.js';
import Product from '../../models/product.js';
import ProductTypes from '../types/product-types.js';
import UserTypes from '../types/user-types.js';
import BrandTypes from '../types/brand-types.js';
import pkg from 'graphql-iso-date';

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
    branding: { type: GraphQLInt },
    price_point: { type: GraphQLInt },
    appearance: { type: GraphQLInt },
    nutritional_value: { type: GraphQLInt },
    packaging: { type: GraphQLInt },
    taste: { type: GraphQLInt },
    affordability: { type: GraphQLInt },
    texture: { type: GraphQLInt },
    scent: { type: GraphQLInt },
    message: { type: GraphQLString },
    history: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    specific_types: { type: new GraphQLList(GraphQLString) },
    benefits: { type: new GraphQLList(GraphQLString) },
    brand_id: { type: GraphQLID },
    product_id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    status: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    faqs: { type: new GraphQLList(FaqsTypes) },
    reactions: { type: new GraphQLList(ReactionType) },
    user: {
      type: UserTypes,
      resolve(parent, args) {
        return User.findById(parent.user_id);
      },
    },

    brand: {
      type: BrandTypes,
      resolve(parent, args) {
        return Brand.findById(parent.brand_id);
      },
    },
    product: {
      type: ProductTypes,
      resolve(parent, args) {
        return Product.findById(parent.product_id);
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

const ReactionType = new GraphQLObjectType({
  name: 'ReactionsType',
  fields: () => ({
    review_id: { type: GraphQLID },
    emoji: { type: GraphQLString },
    by: { type: GraphQLString },
  }),
});

export { ReactionType };

export default ReviewTypes;
