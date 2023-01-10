import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';
import Category from '../../models/category.js';
import CategoryType from '../types/category-type.js';
import slugify from 'slugify';
import SubCategory from '../../models/sub-category.js';
import { uploadFile } from '../schema/local-file-upload.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

const addCategory = {
    type: CategoryType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }

        //  * CHECK IF CATEGORY ALREADY EXIST

        const categoryExist = await Category.find({ slug: slugify(args?.name, { lower: true }) })

        if (categoryExist?.length > 0) {
            throw new ApolloError('Category already exists');
        }


        const newCategory = new Category({
            name: args?.name,
            slug: slugify(args?.name, { lower: true }),
            image: '',
        })
        const ct = newCategory.save();
        return ct;
        // await (newCategory.save()).then(async (res) => {
        //     if (args?.image) {
        //         return await uploadFile(args?.image, `category-${res.id}`).then(async (ress) => {

        //             const data = {
        //                 image: ress ?? ''
        //             }

        //             const options = { new: true };
        //             const category = await Category.findOneAndUpdate(
        //                 { _id: res?.id },
        //                 data,
        //                 options);
        //             console.log(category)
        //             return category
        //         });

        //     }
        //     return res
        // });
    },
};

const updateCategory = {
    type: CategoryType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLUpload }
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }

        //  * CHECK IF CATEGORY ALREADY EXIST
        // const categoryExist = await Category.find({ slug: slugify(args?.name, { lower: true }) })
        // if (categoryExist?.length > 0) {
        //     throw new ApolloError('Category already exists');
        // }
        if (args?.image) {
            args.image = await uploadFile(args.image, `category-${args?.id}`);
        }

        const data = {
            name: args?.name,
            slug: slugify(args?.name, { lower: true }),
            image: args?.image ?? ''
        }

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
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }
        SubCategory?.find({ category_id: args.id }).then((subCategories) => {
            subCategories?.forEach((subCategory) => {
                //  * DELETE BRAND REVIEWS
                subCategory?.remove()
            });
        });

        const category = await Category.findByIdAndDelete(args.id)
        return category;
    },
};



export { addCategory, updateCategory, deleteCategory }

