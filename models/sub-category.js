import mongoose from 'mongoose';

// * Cat, Dogs
const SubCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        slug: {
            type: String
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }

    },

    {
        timestamps: true,
    }
);

export default mongoose.model('SubCategory', SubCategorySchema);
