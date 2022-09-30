import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import UserTypes, { SocialType } from './user-types.js';
import ReviewTypes from './review-types.js';
import User from '../../models/user.js';
import Review from '../../models/review.js';
import Product from '../../models/product.js';
import ProductTypes from './product-types.js';
import { DEFAULT_REVIEW_COUNT, REVIEW_STAT } from '../../constants.js';

const { GraphQLDateTime } = pkg;

// const SocialType = new GraphQLObjectType({
//   name: 'Social',
//   fields: () => ({
//     facebook: { type: GraphQLString },
//     twitter: { type: GraphQLString },
//     instagram: { type: GraphQLString },
//     linkedin: { type: GraphQLString },
//     youtube: { type: GraphQLString },
//     telegram: { type: GraphQLString },
//     soundcloud: { type: GraphQLString },
//     spotify: { type: GraphQLString },
//     vkontakte: { type: GraphQLString },
//   }),
// });

// * BRAND TYPE
const BrandTypes = new GraphQLObjectType({
  name: 'Brand',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    name: { type: GraphQLString },
    website: { type: GraphQLString },
    social_links: { type: SocialType },
    slogan: { type: GraphQLString },
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
    tags: {
      type: new GraphQLList(GraphQLString),
      async resolve(parent) {
        let array = [];
        const reviews = await Review.find({ brand_id: parent.id });
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
      type: new GraphQLList(GraphQLFloat),
      async resolve(parent, args) {
        const reviews = await Review.find({ brand_id: parent.id });
        const ratings = reviews?.map((review) => review.rating);
        return ratings;
      },
    },
  }),
});

export default BrandTypes;
