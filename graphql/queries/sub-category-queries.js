import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import { ApolloError } from 'apollo-server-errors';
import { USER_ROLES } from '../../constants.js';
import SubCategory from '../../models/sub-category.js';
import { SubCategoryType } from '../types/sub-category-type.js';

const allSubCategory = {
    type: new GraphQLList(SubCategoryType),
    args: {
        categoryID: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }
        console.log("herererer")
        return SubCategory.find({ category_id: args?.categoryID });
    },

};
const subCategory = {
    type: SubCategoryType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }
        return SubCategory.findById(args?.id);
    },
};

export { allSubCategory, subCategory }