import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import Review from '../../models/review.js';
import ReviewTypes from '../types/review-types.js';
import { ApolloError } from 'apollo-server-errors';

const reviews = {
  type: new GraphQLList(ReviewTypes),
  args: {
    limit: { type: GraphQLInt },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    const DEFAULT_LIMIT = 10;

    return Review.find().skip(args.limit).limit(DEFAULT_LIMIT);
  },
};

const review = {
  type: ReviewTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve(parent, args) {
    return Review.findById(args.id);
  },
};
const recentBrandReviews = {
  type: new GraphQLList(ReviewTypes),
  args: {
    brand_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve(parent, args) {
    return Review.find({ brand_id: args.id }).sort({ timestamp: -1 });
  },

};
const recentProductReviews = {
  type: new GraphQLList(ReviewTypes),
  args: {
    product_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve(parent, args) {
    return Review.find({ product_id: args.id }).sort({ timestamp: -1 });
  },

};

const reviewsCount = {
  type: GraphQLInt,

  async resolve(parent, args) {
    return Review.find().count();
  },
};

export {
  reviews, review, reviewsCount, recentBrandReviews, recentProductReviews
};
