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
import { SubCategoryType } from './sub-category-type.js';
import SubCategory from '../../models/sub-category.js';
const { GraphQLDateTime } = pkg;

// * SubCategory TYPE
const SubCategoryDetailsType = new GraphQLObjectType({
    name: 'SubCategoryDetails',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        type: { type: new GraphQLList(GraphQLString) },
        subCategory: {
            type: SubCategoryType,
            resolve(parent, args) {
                return SubCategory.findById(parent.subCategory_id);
            },
        },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});
export { SubCategoryDetailsType }