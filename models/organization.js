import mongoose from 'mongoose';
import { USER_ROLES, USER_STATUS } from '../constants.js';

const OrgSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        slug: {
            type: String,
            unique: true
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Organization', OrgSchema);
