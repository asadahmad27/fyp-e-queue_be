import { ApolloError } from 'apollo-server-errors';
import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt
} from 'graphql';
import TicketType from '../types/ticket-type.js';
import { TICKET_STATUS } from '../../constants.js';
import Ticket from '../../models/ticket.js';

const createTicket = {
    type: TicketType,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        window_id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }

        let allTokens = await Ticket.find({ window_id: args?.window_id }).count();
        let data = new Ticket({
            number: allTokens + 1,
            user_id: args?.user_id,
            window_id: args?.window_id,
            status: args?.status ?? TICKET_STATUS.PENDING,

        });
        let newTicket = await data.save();

        return newTicket
    },
};

const updateTicket = {
    type: TicketType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: GraphQLString },
        number: { type: GraphQLString },
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }

        let data = {
            status: args?.status ?? TICKET_STATUS.DONE,
        };

        let options = { new: true };
        let token = await Ticket.findOneAndUpdate(
            { _id: args.id },
            data,
            options);


        let nextTicket = await Ticket.find({ number: parseInt(args?.status) + 1 });
        let nextTokenData = {
            status: TICKET_STATUS.SERVING,
        };
        options = { new: true };
        token = await Ticket.findOneAndUpdate(
            { _id: nextTicket.id },
            nextTokenData,
            options);

        return token;
    },
};

// const deleteWindow = {
//     type: WindowType,
//     args: {
//         id: { type: new GraphQLNonNull(GraphQLID) },

//     },
//     async resolve(parent, args, req) {
//         //  * CHECK TOKEN

//         if (!req.isAuth) {
//             throw new ApolloError('Not authenticated');
//         }
//         // SubCategory?.find({ category_id: args.id }).then((subCategories) => {
//         //     subCategories?.forEach(async (subCategory) => {
//         //         await DeleteFile('sub-category', subCategory?._id)
//         //         //  * DELETE BRAND REVIEWS
//         //         subCategory?.remove()
//         //     });
//         // });
//         // await DeleteFile('category', args?.id)
//         const window = await Window.findByIdAndDelete(args.id)
//         return window;
//     },
// };



export { createTicket, updateTicket }