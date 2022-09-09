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
import Review from '../../models/review.js';
import BrandTypes from './brand-types.js';

const { GraphQLDateTime } = pkg;

// * SEARCH TYPE
const SearchTypes = new GraphQLObjectType({
  name: 'Search',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    brand_id: { type: GraphQLID },
    name: { type: GraphQLString },
    brand_reviews_rating: {
      type: GraphQLString,
      async resolve(parent, args) {
        const initialValue = 0;
        const reviews = await Review.find({ brand_id: parent.id });
        const reviews_count = reviews?.length;
        const ratings = reviews?.map((review) => review.rating);
        const rating_count = ratings.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          initialValue
        );
        const count = rating_count / reviews_count;

        return count.toFixed(1);
      },
    },
    brand_reviews_count: {
      type: GraphQLInt,
      resolve(parent, args) {
        return Review.find({ brand_id: parent.id }).count();
      },
    },
    product_reviews_count: {
      type: GraphQLInt,
      resolve(parent, args) {
        return Review.find({ product_id: parent.id }).count();
      },
    },
    product_reviews_rating: {
      type: GraphQLString,
      async resolve(parent, args) {
        const initialValue = 0;
        const reviews = await Review.find({ product_id: parent.id });
        const reviews_count = reviews?.length;
        const ratings = reviews?.map((review) => review.rating);
        const rating_count = ratings.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          initialValue
        );
        const count = rating_count / reviews_count;

        return count.toFixed(1);
      },
    },
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
    user: {
      type: UserTypes,
      resolve(parent, args) {
        return User.findById(parent.user_id);
      },
    },
    logo: {
      type: GraphQLString,
      resolve(parent, args) {
        let imageUrl;
        if (parent.logo) {
          imageUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: parent.logo,
          });
        }
        return imageUrl || parent.logo;
      },
    },
  }),
});

export default SearchTypes;
