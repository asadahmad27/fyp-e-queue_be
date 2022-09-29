import mongoose from 'mongoose';
import { REVIEW_STATUS } from '../constants.js';

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      default: 0,
    },
    aesthetics: {
      type: Number,
      default: 0,
    },
    customer_service: {
      type: Number,
      default: 0,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    sustainability: {
      type: Number,
      default: 0,
    },
    branding: {
      type: Number,
      default: 0,
    },
    price_point: {
      type: Number,
      default: 0,
    },

    appearance: {
      type: Number,
      default: 0,
    },

    nutritional_value: {
      type: Number,
      default: 0,
    },

    packaging: {
      type: Number,
      default: 0,
    },

    taste: {
      type: Number,
      default: 0,
    },
    affordability: {
      type: Number,
      default: 0,
    },
    texture: {
      type: Number,
      default: 0,
    },
    scent: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
    },
    specific_types: {
      type: [String],
    },
    benefits: {
      type: [String],
    },
    message: {
      type: String,
    },
    history: {
      type: String,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brands',
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    status: {
      type: String,
      enum: [REVIEW_STATUS.APPROVED, REVIEW_STATUS.DISAPPROVED],
    },
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    reactions: [
      {
        review_id: mongoose.Schema.Types.ObjectId,
        emoji: String,
        by: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Reviews', ReviewSchema);
