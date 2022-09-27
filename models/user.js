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
    verified: {
      type: Boolean,
      default: false,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
    send_msg_on_login: {
      type: Boolean,
      default: false,
    },
    total_reviews_allowed: {
      type: Number,
      default: 30,
    },
    total_reviews_done: {
      type: Number,
      default: 0,
    },
    post_feed_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Feeds',
    },
    following_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Users',
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
