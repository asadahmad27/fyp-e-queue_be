import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import CategoryType from './category-type.js';
import Category from '../../models/category.js';
import { SubCategoryDetailsType } from './sub-category-details-type.js';
import SubCategoryDetails from '../../models/sub-category-details.js';
const { GraphQLDateTime } = pkg;

// * SubCategory TYPE
const SubCategoryType = new GraphQLObjectType({
    name: 'SubCategory',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        category: {
            type: CategoryType,
            resolve(parent, args) {
                return Category.findById(parent.category_id);
            },
        },
        details: {
            type: new GraphQLList(SubCategoryDetailsType),
            resolve(parent, args) {

                const cc = SubCategoryDetails.find({ subCategory_id: parent._id });
                console.log(parent, "ppp", cc)
                return cc
            },
        },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});
export { SubCategoryType }