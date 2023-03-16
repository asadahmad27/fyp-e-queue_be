import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import OrgType from '../types/org-type.js';
import Organization from '../../models/organization.js';

const allOrg = {
    type: new GraphQLList(OrgType),
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }

        return Organization.find();
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

export { allOrg }