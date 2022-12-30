import mongoose from 'mongoose';

// Persian Cat, Bull dog
const SubCategoryDetailsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        slug: {
            type: String
        },
        type: {
            type: Array
        },
        subCategory_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true
        }

    },

    {
        timestamps: true,
    }
);

export default mongoose.model('SubCategoryDetails', SubCategoryDetailsSchema);
