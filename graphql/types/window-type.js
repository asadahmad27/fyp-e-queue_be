import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import UserType from './user-types.js';
import User from '../../models/user.js';

const { GraphQLDateTime } = pkg;

// * Window TYPE
const WindowType = new GraphQLObjectType({
    name: 'Window',
    fields: () => ({
        id: { type: GraphQLID },
        org_id: { type: GraphQLID },
        title: { type: GraphQLString },
        subtitle: { type: GraphQLString },
        slug: { type: GraphQLString },
        emp_id: { type: GraphQLString },
        employ: {
            type: UserType,
            resolve(parent, args) {

                return User.findById(parent.emp_id);
            },
        },
        counter_num: { type: GraphQLString },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});


export default WindowType;
