import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLBoolean
} from 'graphql';
import AdListType from '../types/ad-list-type.js';
import AdList from '../../models/ad-list.js';

const createAdList = {
    type: AdListType,
    args: {
        title: { type: GraphQLString },
        category: { type: new GraphQLNonNull(GraphQLID) },
        subCategory: { type: new GraphQLNonNull(GraphQLID) },
        subCategory_details: { type: new GraphQLNonNull(GraphQLID) },
        subCategory_types: { type: GraphQLString },
        province: { type: GraphQLString },
        city: { type: GraphQLString },
        age: { type: GraphQLString },
        price: { type: GraphQLString },
        home_delivery: { type: GraphQLString },
        description: { type: GraphQLString },
        primary_phone: { type: GraphQLString },
        secondary_phone: { type: GraphQLString },
        allow_whatsapp_contact: { type: GraphQLBoolean },
    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }

        const newAd = new AdList({
            title: args?.title,
            category: args?.category,
            subCategory: args?.category,
            subCategory_details: args?.subCategory_details,
            subCategory_types: args?.subCategory_types,
            province: args?.province,
            city: args?.city,
            age: args?.age,
            price: args?.price,
            home_delivery: args?.home_delivery,
            description: args?.description,
            primary_phone: args?.primary_phone,
            secondary_phone: args?.secondary_phone,
            allow_whatsapp_contact: args?.allow_whatsapp_contact ?? boolean
        })

        const ad = await newAd.save();
        return ad;
    },
};

const updateAdList = {
    type: AdListType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        category: { type: new GraphQLNonNull(GraphQLID) },
        subCategory: { type: new GraphQLNonNull(GraphQLID) },
        subCategory_details: { type: new GraphQLNonNull(GraphQLID) },
        subCategory_types: { type: GraphQLString },
        province: { type: GraphQLString },
        city: { type: GraphQLString },
        age: { type: GraphQLString },
        price: { type: GraphQLString },
        home_delivery: { type: GraphQLString },
        description: { type: GraphQLString },
        primary_phone: { type: GraphQLString },
        secondary_phone: { type: GraphQLString },
        allow_whatsapp_contact: { type: GraphQLBoolean },
    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }

        const data = {
            title: args?.title,
            category: args?.category,
            subCategory: args?.category,
            subCategory_details: args?.subCategory_details,
            subCategory_types: args?.subCategory_types,
            province: args?.province,
            city: args?.city,
            age: args?.age,
            price: args?.price,
            home_delivery: args?.home_delivery,
            description: args?.description,
            primary_phone: args?.primary_phone,
            secondary_phone: args?.secondary_phone,
            allow_whatsapp_contact: args?.allow_whatsapp_contact ?? boolean
        }

        const options = { new: true };
        const ad = await AdList.findOneAndUpdate(
            { _id: args.id },
            data,
            options);

        return ad;
    },
};


const deleteteAdList = {
    type: AdListType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }

        const ad = await AdList.findByIdAndDelete(args.id)
        return ad;
    },
};

export {
    createAdList,
    updateAdList,
    deleteteAdList
}