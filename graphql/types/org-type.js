import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import UserType from './user-types.js';
import User from '../../models/user.js';

const { GraphQLDateTime } = pkg;

// * Org TYPE
const OrgType = new GraphQLObjectType({
    name: 'Organization',
    fields: () => ({
        id: { type: GraphQLID },

        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        admin: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ org_id: parent.id })
            },
        },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});


export default OrgType;
