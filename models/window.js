import mongoose from 'mongoose';

const WindowSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        subtitle: {
            type: String,
        },
        slug: {
            type: String,
        },
        counter_num: {
            type: String,
        },

        emp_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        org_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Window', WindowSchema);
