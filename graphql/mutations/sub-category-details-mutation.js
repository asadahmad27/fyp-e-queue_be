import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLList
} from 'graphql';
import CategoryType from '../types/category-type.js';
import slugify from 'slugify';
import { SubCategoryDetailsType } from '../types/sub-category-details-type.js';
import SubCategoryDetails from '../../models/sub-category-details.js';
import randomstring from 'randomstring';

const createSubCategoryDetails = {
    type: SubCategoryDetailsType,
    args: {
        name: { type: GraphQLString },
        type: { type: new GraphQLList(GraphQLString) },
        subCategoryID: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }

        //  * CHECK IF CATEGORY ALREADY EXIST

        const slug = `${slugify(args?.name, { lower: true })}-${randomstring.generate(12).toLowerCase()}`;
        const newSubCategoryDetails = new SubCategoryDetails({
            name: args?.name,
            slug,
            subCategory_id: args?.subCategoryID,
            type: args?.type
        })
        const details = await newSubCategoryDetails.save();
        return details;
    },
};

const updateSubCategoryDetails = {
    type: SubCategoryDetailsType,
    args: {
        data: { type: GraphQLString },
        subCategoryId: { type: new GraphQLNonNull(GraphQLID) },

    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }


        const parsedData = args?.data ? JSON.parse(args?.data) : []

        const mapped = parsedData?.map(async (item, index) => {

            const slug = `${slugify(item?.name, { lower: true })}-${randomstring.generate(12).toLowerCase()}`;
            const data = {
                name: item?.name,
                slug,
                type: item?.type ?? [],
                subCategory_id: args?.subCategoryId
            }


            const options = { new: true };
            const subCategoryDetails = await SubCategoryDetails.findOneAndUpdate(
                { _id: item?.id },
                data,
                options);
            return subCategoryDetails

        })
        return mapped
        return true
    },
};

const deleteSubCategoryDetails = {
    type: CategoryType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }

        const subCategoryDetails = await SubCategoryDetails.findByIdAndDelete(args.id)
        return subCategoryDetails;
    },
};



export {
    createSubCategoryDetails,
    updateSubCategoryDetails,
    deleteSubCategoryDetails
}

