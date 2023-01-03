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
import { SubCategoryType } from '../types/sub-category-type.js';
import randomstring from 'randomstring';
import SubCategoryDetails from '../../models/sub-category-details.js';


///////  Pets -----> cats
///////  Pet food -----> cats


const addSubCategory = {
    type: SubCategoryType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
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
        return subCategory;
    },
};

const updateSubCategory = {
    type: SubCategoryType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        categoryID: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }


        const slug = `${slugify(args?.name, { lower: true })}-${randomstring.generate(12).toLowerCase()}`;
        const data = {
            name: args?.name,
            slug,
            category: args?.categoryID
        }

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
        SubCategoryDetails?.find({ subCategory_id: args.id }).then((details) => {
            details?.forEach((detail) => {
                //  * DELETE BRAND REVIEWS
                detail?.remove()
            });
        });
        const subCategory = await SubCategory.findByIdAndDelete(args.id)
        return subCategory;
    },
};



export {
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
}

