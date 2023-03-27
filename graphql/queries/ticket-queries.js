import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import TicketType from '../types/ticket-type.js';
import Ticket from '../../models/ticket.js';

const allTickets = {
    type: new GraphQLList(TicketType),
    args: {
        window_id: { type: new GraphQLNonNull(GraphQLID) },

    },
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }

        return Ticket.find({ window_id: args.window_id });
    },
};
// const window = {
//     type: WindowType,
//     args: {
//         id: { type: new GraphQLNonNull(GraphQLID) },

//     },
//     resolve: (parent, args, req) => {
//         // * CHECK IF TOKEN IS VALID
//         // if (!req.isAuth) {
//         //   throw new ApolloError('Not authenticated');
//         // }


//         return Window.findById(args.id);
//     },
// };

export { allTickets }