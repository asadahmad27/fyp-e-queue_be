import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import UserTypes from './user-types.js';
import User from '../../models/user.js';
import Review from '../../models/review.js';
import BrandTypes from './brand-types.js';
import brand from '../../models/brand.js';
import ReviewTypes from './review-types.js';
import { DEFAULT_REVIEW_COUNT } from '../../constants.js';
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
    reviews_count: {
      type: GraphQLInt,
      resolve(parent, args) {
        return Review.find({ product_id: parent.id }).count();
      },
    },
    reviews: {
      type: new GraphQLList(ReviewTypes),
      resolve(parent, args) {
        return Review.find({ product_id: parent.id })
      },
    },

    reviews_rating: {
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
    tags: {
      type: new GraphQLList(GraphQLString),
      async resolve(parent) {
        let array = [];
        const reviews = await Review.find({ product_id: parent.id });
        reviews?.map((review) => {
          return (array = [...review.tags]);
        });

        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }

        const unique = array.filter(onlyUnique);

        return unique;
      },
    },
    reviews_stat: {
      type: new GraphQLList(GraphQLInt),
      async resolve(parent, args) {
        const reviews = await Review.find({ product_id: parent.id });
        const ratings = reviews?.map((review) => review.rating);
        return ratings;
      },
    },
  }),
});

export default ProductTypes;
