import mongoose from 'mongoose';

const TermsConditionsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('TermsConditions', TermsConditionsSchema);
