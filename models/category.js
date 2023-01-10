import mongoose from 'mongoose';

// **** Pets, Pet Food
const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        slug: {
            type: String
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Category', CategorySchema);
