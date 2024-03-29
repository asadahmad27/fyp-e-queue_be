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

        let allTokens = await Ticket.find({ window_id: args.window_id }).count();
        let data = new Ticket({
            number: allTokens + 1,
            user_id: args.user_id,
            window_id: args.window_id,
            status: args.status || TICKET_STATUS.PENDING,

        });

        let newTicket = await data.save();

        return newTicket
    },
};

const updateTicket = {
    type: TicketType,
    args: {
        status: { type: GraphQLString },
        curr_number: { type: GraphQLString },
        window_id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }

        console.log(args)
        let data = {
            status: TICKET_STATUS.DONE,
        };

        let options = { new: true };
        let curToken = await Ticket.findOneAndUpdate(
            { number: args.curr_number, window_id: args?.window_id },
            data,
            options);

        let nextTokenData = {
            status: TICKET_STATUS.SERVING,
        };
        options = { new: true };
        let newToken = await Ticket.findOneAndUpdate(
            { number: (parseInt(args.curr_number) + 1).toString(), window_id: args?.window_id },
            nextTokenData,
            options);


        return newToken;
    },
};

const deleteAllTickets = {
    type: TicketType,
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }
        let deleteAll = await Ticket?.deleteMany({});
        return deleteAll;
    },
};



export { createTicket, updateTicket, deleteAllTickets }