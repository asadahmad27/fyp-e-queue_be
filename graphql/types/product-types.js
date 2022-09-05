import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import UserTypes from './user-types.js';
import User from '../../models/user.js';
import BrandTypes from './brand-types.js';
import brand from '../../models/brand.js';
import Review from '../../models/review.js';
import ReviewTypes from './review-types.js';
const { GraphQLDateTime } = pkg;

// * PRODUCT TYPE
const ProductTypes = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    brand_id: { type: GraphQLID },
    name: { type: GraphQLString },
    website: { type: GraphQLString },
    link: { type: GraphQLString },
    image: {
      type: GraphQLString,
      resolve(parent, args) {
        let imageUrl;
        if (parent.image) {
          imageUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: parent.image,
          });
        }
        return imageUrl || parent.image;
      },
    },
    about: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    user: {
      type: UserTypes,
      resolve(parent, args) {
        return User.findById(parent.user_id);
      },
    },
    brand: {
      type: BrandTypes,
      resolve(parent, args) {
        return brand.findById(parent.brand_id);
      },
    },
    reviews_count: { type: GraphQLInt },
    reviews: {
      type: new GraphQLList(ReviewTypes),
      resolve(parent, args) {
        return Review.find({ product_id: parent.id });
      },
    },
  }),
});

export default ProductTypes;
