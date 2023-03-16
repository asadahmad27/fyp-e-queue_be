import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';

const { GraphQLDateTime } = pkg;

// * Org TYPE
const OrgType = new GraphQLObjectType({
    name: 'Organization',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});


export default OrgType;
