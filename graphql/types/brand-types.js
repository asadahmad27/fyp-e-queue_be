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
import ReviewTypes from './review-types.js';
import User from '../../models/user.js';
import Review from '../../models/review.js';
import Product from '../../models/product.js';
import ProductTypes from './product-types.js';
import { REVIEW_STAT } from '../../constants.js';


const { GraphQLDateTime } = pkg;

// * BRAND TYPE
const BrandTypes = new GraphQLObjectType({
  name: 'Brand',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    name: { type: GraphQLString },
    website: { type: GraphQLString },
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
    about: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    user: {
      type: UserTypes,
      resolve(parent, args) {
        return User.findById(parent.user_id);
      },
    },
    products: {
      type: new GraphQLList(ProductTypes),
      resolve(parent, args) {
        return Product.find({ brand_id: { $in: parent.id } });
      },
    },

    reviews_count: {
      type: GraphQLInt,
      resolve(parent, args) {
        return Review.find({ brand_id: parent.id }).count();
      },
    },
    reviews: {
      type: new GraphQLList(ReviewTypes),
      resolve(parent, args) {
        return Review.find({ brand_id: parent.id });
      },
    },
    reviews_rating: {
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
    reviews_stat: {
      type: new GraphQLList(GraphQLInt),
      async resolve(parent, args) {
        const reviews = await Review.find({ brand_id: parent.id });
        const ratings = reviews?.map((review) => review.rating);
        return ratings

      },
    }
  }),
});

export default BrandTypes;
