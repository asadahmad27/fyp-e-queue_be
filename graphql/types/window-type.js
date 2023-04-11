import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import UserType from './user-types.js';
import User from '../../models/user.js';
import OrgType from './org-type.js';
import Organization from '../../models/organization.js';

const { GraphQLDateTime } = pkg;

// * Window TYPE
const WindowType = new GraphQLObjectType({
    name: 'Window',
    fields: () => ({
        id: { type: GraphQLID },
        org_id: { type: GraphQLID },
        title: { type: GraphQLString },
        subtitle: { type: GraphQLString },
        serving_status: { type: GraphQLBoolean },
        slug: { type: GraphQLString },
        emp_id: { type: GraphQLString },
        avg_waiting_time: { type: GraphQLString },
        employ: {
            type: UserType,
            resolve(parent, args) {

                return User.findById(parent.emp_id);
            },
        },
        org: {
            type: OrgType,
            resolve(parent, args) {
                return Organization.find({ _id: parent.org_id })
            },
        },
        counter_num: { type: GraphQLString },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});


export default WindowType;
