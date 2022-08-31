import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    website: {
      type: String,
    },
    logo: {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Brands', BrandSchema);
