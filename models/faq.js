import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Faqs', FaqSchema);
