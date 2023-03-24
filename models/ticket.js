import mongoose from 'mongoose';
import { TICKET_STATUS, USER_ROLES, USER_STATUS } from '../constants.js';

const TicketSchema = new mongoose.Schema(
    {
        number: {
            type: Number,
        },
        status: {
            type: String,
            enum: [TICKET_STATUS.PENDING, TICKET_STATUS.SERVING, TICKET_STATUS.DONE, TICKET_STATUS.DISCARD]

        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        window_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Window",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Ticket', TicketSchema);
