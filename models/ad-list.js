import mongoose from 'mongoose';
import { AD_STATUS } from '../constants.js';

const AdListSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        slug: {
            type: String,
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },

        subCategory_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true
        },
        subCategory_details_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategoryDetails',
            required: true
        },
        subCategory_types: {
            type: String,

        },
        province: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        age: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        home_delivery: {
            type: String,
            default: "no",
        },
        description: {
            type: String,
        },
        primary_phone: {
            type: String,
            required: true
        },
        secondary_phone: {
            type: String,
        },
        allow_whatsapp_contact: {
            type: Boolean,
            default: false,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        status: {
            type: String,
            enum: [AD_STATUS.ACTIVE, AD_STATUS.FEATURED, AD_STATUS.SOLD],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('AdList', AdListSchema);
