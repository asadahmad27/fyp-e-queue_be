import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    website: {
      type: String,
    },
    image: {
      type: String,
    },
    about: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brands',
      required: true,
    },

    reviews_count: {
      type: Number,
      default: 0,
    },

    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Products', ProductSchema);
