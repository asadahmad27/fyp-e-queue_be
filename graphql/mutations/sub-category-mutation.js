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
import randomstring from 'randomstring';
import { SubCategoryType } from '../types/sub-category-type.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { uploadFile } from '../schema/local-file-upload.js';

const addSubCategory = {
    type: SubCategoryType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLUpload },
        categoryID: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }

        //  * CHECK IF CATEGORY ALREADY EXIST

        const slug = `${slugify(args?.name, { lower: true })}-${randomstring.generate(12).toLowerCase()}`;

        const newSubCategory = new SubCategory({
            name: args?.name,
            slug,
            category_id: args?.categoryID
        })
        const subCategory = await newSubCategory.save();
        const imageName = args?.image ? await uploadFile(args?.image, `sub-category-${subCategory._id}`) : ''

        const data = {
            image: imageName ?? ''
        }
        const options = { new: true };

        const editedCate = await SubCategory.findOneAndUpdate(
            { _id: subCategory?._id },
            data,
            options);

        return editedCate
    },
};

const updateSubCategory = {
    type: SubCategoryType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLUpload },
        categoryID: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }
        if (args?.image) {
            args.image = await uploadFile(args.image, `sub-category-${args?.id}`);
        }

        const slug = `${slugify(args?.name, { lower: true })}-${randomstring.generate(12).toLowerCase()}`;
        const data = {
            name: args?.name,
            slug,
            category: args?.categoryID,
            image: args?.image
        }

        if (!args?.image) {
            delete data?.image
        }

        console.log(data)
        const options = { new: true };
        const subCategory = await SubCategory.findOneAndUpdate(
            { _id: args.id },
            data,
            options);

        return subCategory;
    },
};

const deleteSubCategory = {
    type: CategoryType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }
        // SubCategoryDetails?.find({ subCategory_id: args.id }).then((details) => {
        //     details?.forEach((detail) => {
        //         //  * DELETE BRAND REVIEWS
        //         detail?.remove()
        //     });
        // });
        const subCategory = await SubCategory.findByIdAndDelete(args.id)
        return subCategory;
    },
};



export {
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
}

