import { ApolloError } from 'apollo-server-errors';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLEnumType,
  GraphQLFloat,
} from 'graphql';
import Review from '../../models/review.js';
import User from '../../models/user.js';
import ReviewTypes, { ReactionType } from '../types/review-types.js';
import { REVIEW_STATUS, REVIEW_NOT_ALLOWED } from '../../constants.js';

const createBrandReview = {
  type: ReviewTypes,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    rating: { type: new GraphQLNonNull(GraphQLFloat) },
    aesthetics: { type: new GraphQLNonNull(GraphQLFloat) },
    customer_service: { type: new GraphQLNonNull(GraphQLFloat) },
    sustainability: { type: new GraphQLNonNull(GraphQLFloat) },
    branding: { type: new GraphQLNonNull(GraphQLFloat) },
    price_point: { type: new GraphQLNonNull(GraphQLFloat) },
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

    const user = await User.findOne({ _id: args.user_id });

    if (user.total_reviews_allowed === user.total_reviews_done) {
      throw new ApolloError(REVIEW_NOT_ALLOWED);
    }

    const newReview = new Review({
      user_id: args.user_id,
      rating: args.rating,
      aesthetics: args.aesthetics,
      customer_service: args.customer_service,
      sustainability: args.sustainability,
      price_point: args.price_points,
      branding: args.branding,
      message: args.message ?? '',
      history: args.history ?? '',
      tags: args.tags,
      brand_id: args.brand_id,
      status: args?.status,
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

const createProductReview = {
  type: ReviewTypes,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    rating: { type: new GraphQLNonNull(GraphQLFloat) },
    appearance: { type: new GraphQLNonNull(GraphQLFloat) },
    nutritional_value: { type: new GraphQLNonNull(GraphQLFloat) },
    scent: { type: new GraphQLNonNull(GraphQLFloat) },
    affordability: { type: new GraphQLNonNull(GraphQLFloat) },
    texture: { type: new GraphQLNonNull(GraphQLFloat) },
    packaging: { type: new GraphQLNonNull(GraphQLFloat) },
    taste: { type: new GraphQLNonNull(GraphQLFloat) },
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

    const user = await User.findOne({ _id: args.user_id });

    if (user.total_reviews_allowed === user.total_reviews_done) {
      throw new ApolloError(REVIEW_NOT_ALLOWED);
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
    rating: { type: new GraphQLNonNull(GraphQLFloat) },
    aesthetics: { type: new GraphQLNonNull(GraphQLFloat) },
    customer_service: { type: new GraphQLNonNull(GraphQLFloat) },
    sustainability: { type: new GraphQLNonNull(GraphQLFloat) },
    branding: { type: new GraphQLNonNull(GraphQLFloat) },
    price_point: { type: new GraphQLNonNull(GraphQLFloat) },
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
    rating: { type: new GraphQLNonNull(GraphQLFloat) },
    appearance: { type: new GraphQLNonNull(GraphQLFloat) },
    nutritional_value: { type: new GraphQLNonNull(GraphQLFloat) },
    scent: { type: new GraphQLNonNull(GraphQLFloat) },
    affordability: { type: new GraphQLNonNull(GraphQLFloat) },
    texture: { type: new GraphQLNonNull(GraphQLFloat) },
    packaging: { type: new GraphQLNonNull(GraphQLFloat) },
    taste: { type: new GraphQLNonNull(GraphQLFloat) },
    message: { type: GraphQLString },
    tags: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    specific_types: {
      type: new GraphQLList(GraphQLString),
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

const addReactions = {
  type: ReactionType,
  args: {
    review_id: { type: new GraphQLNonNull(GraphQLID) },
    emoji: { type: new GraphQLNonNull(GraphQLString) },
    by: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    const review = await Review.findOne({ _id: args.review_id });
    const newData = {
      review_id: args.review_id,
      emoji: args.emoji,
      by: args.by,
    };
    review.reactions.push(newData);
    review.save();

    return newData;
  },
};
const updateReactions = {
  type: ReactionType,
  args: {
    review_id: { type: new GraphQLNonNull(GraphQLID) },
    emoji: { type: new GraphQLNonNull(GraphQLString) },
    by: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    const review = await Review.findOne({ _id: args.review_id });

    const newData = {
      review_id: args.review_id,
      emoji: args.emoji,
      by: args.by,
    };
    const newArray = review.reactions.map((item) => {
      if (item.by === args.by) {
        return {
          review_id: args.review_id,
          emoji: args.emoji,
          by: args.by,
        };
      }
      return item;
    });

    const data = {
      reactions: newArray,
    };

    const options = { new: true };
    await Review.findOneAndUpdate({ _id: args.review_id }, data, options);

    return newData;
  },
};

export {
  createBrandReview,
  updateBrandReview,
  deleteReview,
  updateReviewStatus,
  updateProductReview,
  createProductReview,
  addReactions,
  updateReactions,
};
