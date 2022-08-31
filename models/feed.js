import mongoose from 'mongoose';

const FeedSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Feeds', FeedSchema);
