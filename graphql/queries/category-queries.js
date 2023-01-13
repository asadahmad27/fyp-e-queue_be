import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import Category from '../../models/category.js';
import CategoryType from '../types/category-type.js';
import { ApolloError } from 'apollo-server-errors';
import { USER_ROLES } from '../../constants.js';

const allCategory = {
    type: new GraphQLList(CategoryType),
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }

        return Category.find();
    },
};
const category = {
    type: CategoryType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

    },
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }

        console.log(args.id)
        return Category.findById(args.id);
    },
};

export { allCategory, category }