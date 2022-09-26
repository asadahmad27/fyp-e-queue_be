import mongoose from 'mongoose';
import { USER_ROLES } from '../constants.js';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: [USER_ROLES.ADMIN, USER_ROLES.USER],
    },
    password: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
    about: {
      type: String,
    },
    social_links: {
      type: Object,
      default: {},
    },
    personal_feeds: {
      type: Array,
      default: [],
    },
    post_feed_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Feeds',
    },
    follower_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Users',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Users', UserSchema);
