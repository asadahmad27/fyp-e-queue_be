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
        serving_status: {
            type: Boolean,
            default: false
        },
        emp_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        org_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
        },
        avg_waiting_time: {
            type: String,
            default: "5"
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Window', WindowSchema);
