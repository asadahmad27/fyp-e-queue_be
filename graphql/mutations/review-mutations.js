import { ApolloError } from 'apollo-server-errors';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLEnumType,
} from 'graphql';
import Review from '../../models/review.js';
import User from '../../models/user.js';
import ReviewTypes from '../types/review-types.js';
import { REVIEW_STATUS } from '../../constants.js';

const createBrandReview = {
  type: ReviewTypes,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    rating: { type: new GraphQLNonNull(GraphQLInt) },
    aesthetics: { type: new GraphQLNonNull(GraphQLInt) },
    customer_service: { type: new GraphQLNonNull(GraphQLInt) },
    sustainability: { type: new GraphQLNonNull(GraphQLInt) },
    branding: { type: new GraphQLNonNull(GraphQLInt) },
    price_point: { type: new GraphQLNonNull(GraphQLInt) },
    message: { type: GraphQLString },
    history: { type: GraphQLString },
    tags: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    brand_id: { type: new GraphQLNonNull(GraphQLID) },
    status: {
      type: new GraphQLEnumType({
        name: 'reviewStatus',
        values: {
          approved: { value: REVIEW_STATUS.APPROVED },
          disapproved: { value: REVIEW_STATUS.DISAPPROVED },
        },
      }),
      defaultValue: REVIEW_STATUS.DISAPPROVED,
    },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    const newReview = new Review({
      user_id: args.user_id,
      rating: args.rating,
      aesthetics: args.aesthetics,
      customer_service: args.customer_service,
      sustainability: args.sustainability,
      price_points: args.price_points,
      branding: args.branding,
      message: args.message ?? '',
      history: args.history ?? '',
      tags: args.tags,
      brand_id: args.brand_id,
      status: args?.status,
    });

    const review = await newReview.save();
    const options = { new: true };
    const userData = await User.findById(args.user_id)
    await User.findOneAndUpdate(
      { _id: args.user_id },
      { total_reviews_done: userData.total_reviews_done + 1 },
      options
    );
    userData.save();

    return review;
  },
};

const createProductReview = {
  type: ReviewTypes,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    rating: { type: new GraphQLNonNull(GraphQLInt) },
    appearance: { type: new GraphQLNonNull(GraphQLInt) },
    nutritional_value: { type: new GraphQLNonNull(GraphQLInt) },
    scent: { type: new GraphQLNonNull(GraphQLInt) },
    affordability: { type: new GraphQLNonNull(GraphQLInt) },
    texture: { type: new GraphQLNonNull(GraphQLInt) },
    packaging: { type: new GraphQLNonNull(GraphQLInt) },
    taste: { type: new GraphQLNonNull(GraphQLInt) },
    message: { type: GraphQLString },
    tags: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    specific_types: {
      type: new GraphQLList(GraphQLString),
    },
    benefits: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    product_id: { type: new GraphQLNonNull(GraphQLID) },
    status: {
      type: new GraphQLEnumType({
        name: 'reviewProductStatus',
        values: {
          approved: { value: REVIEW_STATUS.APPROVED },
          disapproved: { value: REVIEW_STATUS.DISAPPROVED },
        },
      }),
      defaultValue: REVIEW_STATUS.DISAPPROVED,
    },
    faqs: { type: GraphQLString },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    const newReview = new Review({
      user_id: args.user_id,
      rating: args.rating,
      appearance: args.appearance,
      nutritional_value: args.nutritional_value,
      packaging: args.packaging,
      taste: args.taste,
      scent: args.scent,
      texture: args.texture,
      affordability: args.affordability,
      message: args.message ?? '',
      tags: args.tags,
      specific_types: args.specific_types,
      benefits: args.benefits,
      brand_id: args.brand_id,
      product_id: args.product_id,
      status: args?.status,
      faqs: JSON.parse(args.faqs) ?? [],
    });

    const review = await newReview.save();
    const options = { new: true };
    const userData = await User.findById(args.user_id);
    await User.findOneAndUpdate(
      { _id: args.user_id },
      { total_reviews_done: userData.total_reviews_done + 1 },
      options
    );
    userData.save();

    return review;
  },
};

const updateBrandReview = {
  type: ReviewTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    rating: { type: new GraphQLNonNull(GraphQLInt) },
    aesthetics: { type: new GraphQLNonNull(GraphQLInt) },
    customer_service: { type: new GraphQLNonNull(GraphQLInt) },
    sustainability: { type: new GraphQLNonNull(GraphQLInt) },
    branding: { type: new GraphQLNonNull(GraphQLInt) },
    price_points: { type: new GraphQLNonNull(GraphQLInt) },
    message: { type: GraphQLString },
    history: { type: GraphQLString },
    tags: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    brand_id: { type: new GraphQLNonNull(GraphQLID) },
    status: {
      type: new GraphQLEnumType({
        name: 'updateStatus',
        values: {
          approved: { value: REVIEW_STATUS.APPROVED },
          disapproved: { value: REVIEW_STATUS.DISAPPROVED },
        },
      }),
      defaultValue: REVIEW_STATUS.DISAPPROVED,
    },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const data = {
      user_id: args.user_id,
      rating: args.rating,
      aesthetics: args.aesthetics ?? 0,
      customer_service: args.customer_service ?? 0,
      sustainability: args.sustainability ?? 0,
      price_points: args.price_points,
      branding: args.branding,
      message: args.message ?? '',
      history: args.history ?? '',
      tags: args.tags ?? '',
      brand_id: args.brand_id ?? '',
      status: args?.status,
    };

    const options = { new: true };
    const updatedReview = await Review.findOneAndUpdate(
      { _id: args.id },
      data,
      options
    );
    return updatedReview;
  },
};

const updateProductReview = {
  type: ReviewTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    rating: { type: new GraphQLNonNull(GraphQLInt) },
    appearance: { type: new GraphQLNonNull(GraphQLInt) },
    nutritional_value: { type: new GraphQLNonNull(GraphQLInt) },
    packaging: { type: new GraphQLNonNull(GraphQLInt) },
    taste: { type: new GraphQLNonNull(GraphQLInt) },
    scent: { type: new GraphQLNonNull(GraphQLInt) },
    affordability: { type: new GraphQLNonNull(GraphQLInt) },
    texture: { type: new GraphQLNonNull(GraphQLInt) },
    message: { type: GraphQLString },
    tags: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    specific_types: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
    },
    benefits: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    product_id: { type: new GraphQLNonNull(GraphQLID) },
    status: {
      type: new GraphQLEnumType({
        name: 'updateProductStatus',
        values: {
          approved: { value: REVIEW_STATUS.APPROVED },
          disapproved: { value: REVIEW_STATUS.DISAPPROVED },
        },
      }),
      defaultValue: REVIEW_STATUS.DISAPPROVED,
    },
    faqs: { type: GraphQLString },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const data = {
      user_id: args.user_id,
      rating: args.rating,
      appearance: args.appearance,
      nutritional_value: args.nutritional_value,
      packaging: args.packaging,
      taste: args.taste,
      scent: args.scent,
      texture: args.texture,
      affordability: args.affordability,
      message: args.message ?? '',
      tags: args.tags,
      specific_types: args.specific_types,
      benefits: args.benefits,
      brand_id: args.brand_id,
      product_id: args.product_id,
      status: args?.status,
      faqs: JSON.parse(args.faqs) ?? [],
    };

    const options = { new: true };
    const updatedReview = await Review.findOneAndUpdate(
      { _id: args.id },
      data,
      options
    );
    return updatedReview;
  },
};

const deleteReview = {
  type: ReviewTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const review = await Review.findByIdAndDelete(args.id);
    return review;
  },
};

const updateReviewStatus = {
  type: ReviewTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    status: {
      type: new GraphQLEnumType({
        name: 'changeStatus',
        values: {
          approved: { value: REVIEW_STATUS.APPROVED },
          disapproved: { value: REVIEW_STATUS.DISAPPROVED },
        },
      }),
      defaultValue: REVIEW_STATUS.DISAPPROVED,
    },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const data = {
      status: args?.status,
    };

    const options = { new: true };
    const updatedReview = await Review.findOneAndUpdate(
      { _id: args.id },
      data,
      options
    );
    return updatedReview;
  },
};

export {
  createBrandReview,
  updateBrandReview,
  deleteReview,
  updateReviewStatus,
  updateProductReview,
  createProductReview,
};
