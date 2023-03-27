import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt
} from 'graphql';
import Organization from '../../models/organization.js';
import OrgType from '../types/org-type.js';

const addOrg = {
    type: OrgType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        slug: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args, req) {

        //  * CHECK IF USER EXISTS
        const orgExist = await Organization.findOne({ slug: args.slug });
        if (orgExist) {
            throw new ApolloError('Org with the same name already exists');
        }

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }

        let data = new Organization({
            name: args.name || '',
            slug: args.slug || '',
        });
        let newOrg = await data.save();

        return newOrg
    },
};

const updateOrg = {
    type: OrgType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        slug: { type: new GraphQLNonNull(GraphQLString) },
    },

    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }

        //  * CHECK IF CATEGORY ALREADY EXIST
        // const categoryExist = await Category.find({ slug: slugify(args.name, { lower: true }) })
        // if (categoryExist.length > 0) {
        //     throw new ApolloError('Category already exists');
        // }
        // if (args.image) {
        //     args.image = await uploadFile(args.image, 'category', args.id, `category-${args.id}`);
        // }

        let data = {
            name: args.name || '',
            slug: args.slug || '',
        };
        // if (!args.image) {
        //     delete data.image;
        // }
        const options = { new: true };
        const org = await Organization.findOneAndUpdate(
            { _id: args.id },
            data,
            options);

        return org;
    },
};

const deleteOrg = {
    type: OrgType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }
        // SubCategory.find({ category_id: args.id }).then((subCategories) => {
        //     subCategories.forEach(async (subCategory) => {
        //         await DeleteFile('sub-category', subCategory._id)
        //         //  * DELETE BRAND REVIEWS
        //         subCategory.remove()
        //     });
        // });
        // await DeleteFile('category', args.id)
        const window = await Organization.findByIdAndDelete(args.id)
        return window;
    },
};



export { addOrg, updateOrg, deleteOrg }

