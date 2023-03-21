import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt
} from 'graphql';
import Window from '../../models/window.js';
import WindowType from '../types/window-type.js';

const addWindow = {
    type: WindowType,
    args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        subtitle: { type: GraphQLString },
        slug: { type: new GraphQLNonNull(GraphQLString) },
        counter_num: { type: GraphQLString },
        emp_id: { type: new GraphQLNonNull(GraphQLID) },
        org_id: { type: new GraphQLNonNull(GraphQLID) },
        avg_waiting_time: { type: GraphQLString },
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }

        let data = new Window({
            title: args?.title ?? '',
            subtitle: args?.subtitle ?? '',
            slug: args?.slug ?? '',
            counter_num: args?.counter_num ?? '',
            emp_id: args?.emp_id ?? '',
            org_id: args?.org_id,
            avg_waiting_time: args?.avg_waiting_time ?? '5',
        });
        let newWindow = await data.save();

        return newWindow
    },
};

const updateWindow = {
    type: WindowType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        subtitle: { type: GraphQLString },
        slug: { type: new GraphQLNonNull(GraphQLString) },
        avg_waiting_time: { type: GraphQLString },
        counter_num: { type: GraphQLString },
        emp_id: { type: new GraphQLNonNull(GraphQLID) },
        org_id: { type: new GraphQLNonNull(GraphQLID) }
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
        // if (args?.image) {
        //     args.image = await uploadFile(args.image, 'category', args?.id, `category-${args?.id}`);
        // }

        let data = {
            title: args?.title ?? '',
            subtitle: args?.subtitle ?? '',
            slug: args?.slug ?? '',
            counter_num: args?.counter_num ?? '',
            emp_id: args?.emp_id ?? '',
            org_id: args?.org_id,
            avg_waiting_time: args?.avg_waiting_time ?? '5',
        };
        // if (!args?.image) {
        //     delete data.image;
        // }
        const options = { new: true };
        const window = await Window.findOneAndUpdate(
            { _id: args.id },
            data,
            options);

        return window;
    },
};

const deleteWindow = {
    type: WindowType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },

    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }
        // SubCategory?.find({ category_id: args.id }).then((subCategories) => {
        //     subCategories?.forEach(async (subCategory) => {
        //         await DeleteFile('sub-category', subCategory?._id)
        //         //  * DELETE BRAND REVIEWS
        //         subCategory?.remove()
        //     });
        // });
        // await DeleteFile('category', args?.id)
        const window = await Window.findByIdAndDelete(args.id)
        return window;
    },
};



export { addWindow, updateWindow, deleteWindow }

