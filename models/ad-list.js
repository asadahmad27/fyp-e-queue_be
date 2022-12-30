import mongoose from 'mongoose';

const AdListSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },

        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true
        },
        subCategory_details: {
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
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('AdList', AdListSchema);
