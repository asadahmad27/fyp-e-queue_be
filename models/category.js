import mongoose from 'mongoose';


const SubCategoryLevelTwoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
const SubCategoryLevelOneSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        subCategory_level_2: {
            type: [SubCategoryLevelTwoSchema],
        },
    },
    {
        timestamps: true,
    }
);
const SubCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        subCategory_level_1: {
            type: [SubCategoryLevelOneSchema],
        },
    },
    {
        timestamps: true,
    }
);

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        subCategory: {
            type: [SubCategorySchema],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Category', CategorySchema);
