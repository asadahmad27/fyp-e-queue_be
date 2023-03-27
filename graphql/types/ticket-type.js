import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from 'graphql';
import pkg from 'graphql-iso-date';
import User from '../../models/user.js';
import UserType from './user-types.js';
const { GraphQLDateTime } = pkg;

// * TICKET TYPE
const TicketType = new GraphQLObjectType({
    name: 'Ticket',
    fields: () => ({
        id: { type: GraphQLID },
        user_id: { type: GraphQLID },
        window_id: { type: GraphQLID },
        number: { type: GraphQLString },
        curr_number: { type: GraphQLString },
        status: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {

                return User.findById(parent.user_id);
            },
        },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});

export default TicketType;
