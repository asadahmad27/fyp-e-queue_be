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

const { GraphQLDateTime } = pkg;

// * SubCategory TYPE
const SubCategoryType = new GraphQLObjectType({
    name: 'SubCategory',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        image: { type: GraphQLString },
        category: {
            type: CategoryType,
            resolve(parent, args) {

                return Category.findById(parent.category_id);
            },
        },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});
export { SubCategoryType }