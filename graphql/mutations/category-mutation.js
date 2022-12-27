import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLEnumType,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
} from 'graphql';
import Category from '../../models/category.js';
import CategoryType, { subCategoryType } from '../types/category-type.js';

const createCategory = {
    type: CategoryType,
    args: {
        category: { type: new GraphQLNonNull(GraphQLString) },

    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }

        //  * CHECK IF CATEGORY ALREADY EXIST
        const parsed = JSON.parse(args?.category)
        const newCategory = new Category({
            name: parsed?.name,
            subCategory: parsed?.subCategory
        })
        console.log(parsed, args?.category)
        const category = await newCategory.save();

        return category;
    },
};

const updateCategory = {
    type: CategoryType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        category: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }

        //  * CHECK IF CATEGORY ALREADY EXIST
        const parsed = JSON.parse(args?.category)
        const data = {
            name: parsed?.name,
            subCategory: parsed?.subCategory
        }
        console.log(parsed, args?.category, args.id)
        const options = { new: true };
        const category = await Category.findOneAndUpdate(
            { _id: args.id },
            data,
            options);

        return category;
    },
};

const deleteCategory = {
    type: CategoryType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }

        //  * CHECK IF CATEGORY ALREADY EXIST

        const category = await Category.findByIdAndDelete(args.id)
        return category;
    },
};



export { createCategory, updateCategory, deleteCategory }

