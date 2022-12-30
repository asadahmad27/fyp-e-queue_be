import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import { SubCategoryType } from './sub-category-type.js';
import subCategory from '../../models/sub-category.js';
const { GraphQLDateTime } = pkg;

// * Category TYPE
const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        subCategory: {
            type: new GraphQLList(SubCategoryType),
            resolve(parent, args) {
                console.log(parent)
                return subCategory.find({ category_id: parent._id });
            },
        },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});

const mainCategoryType = new GraphQLObjectType({
    name: 'subCategoryLevelTwo',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
    }),
});


const subCategoryLevelOneType = new GraphQLObjectType({
    name: 'subCategoryLevelOne',
    fields: () => ({
        name: { type: GraphQLString },
        subCategory_level_2: { type: new GraphQLList(subCategoryLevelTwoType) },
    }),
});

const subCategoryType = new GraphQLObjectType({
    name: 'subCategory',
    fields: () => ({
        name: { type: GraphQLString },
        subCategory_level_1: { type: new GraphQLList(subCategoryLevelOneType) },
    }),
});

// export { subCategoryType, subCategoryLevelOneType, subCategoryLevelTwoType };

export default CategoryType;
