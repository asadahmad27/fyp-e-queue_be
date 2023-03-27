import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';

import WindowType from '../types/window-type.js';
import Window from '../../models/window.js';

const allWindow = {
    type: new GraphQLList(WindowType),
    args: {
        org_id: { type: new GraphQLNonNull(GraphQLID) },

    },
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }

        return Window.find({ org_id: args.org_id });
    },
};
const window = {
    type: WindowType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

    },
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }


        return Window.findById(args.id);
    },
};

export { allWindow, window }