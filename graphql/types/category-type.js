import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
const { GraphQLDateTime } = pkg;

// * Category TYPE
const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        subCategory: { type: new GraphQLList(subCategoryType) },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});

// const ReactionType = new GraphQLObjectType({
//     name: 'ReactionsType',
//     fields: () => ({
//         review_id: { type: GraphQLID },
//         emoji: { type: GraphQLString },
//         by: { type: GraphQLString },
//     }),
// });

// export { ReactionType };

const subCategoryLevelTwoType = new GraphQLObjectType({
    name: 'subCategoryLevelTwo',
    fields: () => ({
        name: { type: GraphQLString },
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

export { subCategoryType, subCategoryLevelOneType, subCategoryLevelTwoType };

export default CategoryType;
