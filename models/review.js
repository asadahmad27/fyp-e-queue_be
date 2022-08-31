import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Reviews', ReviewSchema);
