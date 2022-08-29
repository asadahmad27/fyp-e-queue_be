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
      enum: [USER_ROLES.ADMIN, USER_ROLES.AUTHOR],
    },
    password: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Users', UserSchema);
