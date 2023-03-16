import mongoose from 'mongoose';
import { USER_ROLES, USER_STATUS } from '../constants.js';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    // last_name: {
    //   type: String,
    // },
    email: {
      type: String,

    },
    phone: {
      type: String,

    },
    role: {
      type: String,
      enum: [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.EMPLOY, USER_ROLES.SUPER_ADMIN],
    },
    password: {
      type: String,
    },
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    }
    // about: {
    //   type: String,
    // },
    // province: {
    //   type: String,
    // },
    // city: {
    //   type: String,
    // },
    // address: {
    //   type: String,
    // },
    // profile_pic: {
    //   type: String,
    // },
    // status: {
    //   type: String,
    //   enum: [USER_STATUS.ACTIVE, USER_STATUS.UNACTIVE],
    // }

  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Users', UserSchema);
