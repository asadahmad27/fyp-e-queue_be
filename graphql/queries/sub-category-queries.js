import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import { ApolloError } from 'apollo-server-errors';
import { USER_ROLES } from '../../constants.js';
import SubCategory from '../../models/sub-category.js';
import { SubCategoryType } from '../types/sub-category-type.js';

const allSubCategory = {
    type: new GraphQLList(SubCategoryType),

    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        // }

        return SubCategory.find();
    },

};
const allSubCategoryByCategoryID = {
    type: new GraphQLList(SubCategoryType),
    args: {
        categoryID: { type: new GraphQLNonNull(GraphQLID) }
    },

    async resolve(parent, args, req) {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        // }


        const cc = await SubCategory.find({ category_id: args?.categoryID });

        return cc
    },

};
const subCategory = {
    type: SubCategoryType,
    args: {
        categoryID: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }
        return SubCategory.findById(args?.id);
    },
};

export { allSubCategory, subCategory, allSubCategoryByCategoryID }