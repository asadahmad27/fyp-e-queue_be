import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLBoolean } from 'graphql';
import Category from '../../models/category.js';
import CategoryType from '../types/category-type.js';
import { ApolloError } from 'apollo-server-errors';
import { USER_ROLES } from '../../constants.js';
import AdListType from '../types/ad-list-type.js';
import AdList from '../../models/ad-list.js';

const allAdList = {
    type: new GraphQLList(AdListType),
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }

        return AdList.find();
    },
};

const allAdListForAdmin = {
    type: new GraphQLList(AdListType),
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }
        return AdList.find();

    },
};
const adList = {
    type: AdListType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        increaseView: { type: GraphQLBoolean }

    },
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }

        return AdList.findById(args.id);
    },
};

export {
    allAdList,
    adList,
    allAdListForAdmin
}