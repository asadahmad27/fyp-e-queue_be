import mongoose from 'mongoose';

const PrivacyPolicySchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('PrivacyPolicy', PrivacyPolicySchema);
