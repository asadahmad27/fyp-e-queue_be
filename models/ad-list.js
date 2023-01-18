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
        sub_category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
        },
        tags: {
            type: Array,
        },
        province: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        age: {
            type: String,
            required: true
        },
        price: {
            type: Number,
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
            enum: [AD_STATUS.ACTIVE, AD_STATUS.SOLD],
        },
        featured: {
            type: String,
            default: "no"
        },
        images: {
            type: Array,
        },
        views: {
            type: Number,
            default: 0,
        },
        vaccinated: {
            type: String,
            default: "no"
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('AdList', AdListSchema);
