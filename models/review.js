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
    tags: {
      type: [String],
    },
    message: {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Reviews', ReviewSchema);
