import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from 'graphql';
import pkg from 'graphql-iso-date';
const { GraphQLDateTime } = pkg;

// * TICKET TYPE
const TicketType = new GraphQLObjectType({
    name: 'Ticket',
    fields: () => ({
        id: { type: GraphQLID },
        org_id: { type: GraphQLID },
        user_id: { type: GraphQLID },
        window_id: { type: GraphQLID },
        number: { type: GraphQLString },
        status: { type: GraphQLString },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});

export default TicketType;
