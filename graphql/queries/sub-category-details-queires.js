import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import { ApolloError } from 'apollo-server-errors';
import { USER_ROLES } from '../../constants.js';
import SubCategory from '../../models/sub-category.js';
import { SubCategoryType } from '../types/sub-category-type.js';
import { SubCategoryDetailsType } from '../types/sub-category-details-type.js';
import SubCategoryDetails from '../../models/sub-category-details.js';

const allSubCategoryDetails = {
    type: new GraphQLList(SubCategoryDetailsType),
    args: {
        subCategoryID: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }
        return SubCategoryDetails.find({ subCategory_id: args?.subCategoryID });
    },

};
// const subCategory = {
//     type: SubCategoryType,
//     args: {
//         id: { type: new GraphQLNonNull(GraphQLID) }
//     },
//     resolve: (parent, args, req) => {
//         // * CHECK IF TOKEN IS VALID
//         // if (!req.isAuth) {
//         //   throw new ApolloError('Not authenticated');
//         // }
//         console.log(args?.id)
//         return SubCategory.findById(args?.id);
//     },
// };

export { allSubCategoryDetails }