import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLList,
    GraphQLInt,
} from 'graphql';
import AdListType from '../types/ad-list-type.js';
import AdList from '../../models/ad-list.js';
import randomstring from 'randomstring';
import slugify from 'slugify';
import { AD_STATUS } from '../../constants.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { DeleteFile, multipleUploadFile, NameCorrect } from '../schema/local-file-upload.js';

const createAdList = {
    type: AdListType,
    args: {
        title: { type: GraphQLString },
        category_id: { type: new GraphQLNonNull(GraphQLID) },
        sub_category_id: { type: GraphQLID },
        tags: { type: GraphQLString },
        province: { type: GraphQLString },
        city: { type: GraphQLString },
        address: { type: GraphQLString },
        age: { type: GraphQLString },
        price: { type: GraphQLInt },
        home_delivery: { type: GraphQLString },
        description: { type: GraphQLString },
        primary_phone: { type: GraphQLString },
        secondary_phone: { type: GraphQLString },
        allow_whatsapp_contact: { type: GraphQLBoolean },
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        images: { type: new GraphQLList(GraphQLUpload) },
        vaccinated: { type: GraphQLString },
        featured: { type: GraphQLString },
        status: {
            type: new GraphQLEnumType({
                name: 'AdStatus',
                values: {
                    active: { value: AD_STATUS.ACTIVE },
                    sold: { value: AD_STATUS.SOLD },
                },
            }),
            defaultValue: AD_STATUS.ACTIVE,
        },
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }
        const slug = `${slugify(args?.title, { lower: true })}-${randomstring.generate(12).toLowerCase()}`;

        const newAd = new AdList({
            title: args?.title,
            slug,
            category_id: args?.category_id,
            sub_category_id: args?.sub_category_id ?? '',
            tags: JSON.parse(args?.tags) ?? [],
            province: args?.province,
            city: args?.city,
            address: args?.address,
            age: args?.age,
            price: args?.price,
            home_delivery: args?.home_delivery,
            description: args?.description,
            primary_phone: args?.primary_phone,
            secondary_phone: args?.secondary_phone,
            allow_whatsapp_contact: args?.allow_whatsapp_contact ?? false,
            user_id: args?.user_id,
            status: args?.status ?? AD_STATUS.ACTIVE,
            featured: args?.featured,
            vaccinated: args?.vaccinated ?? 'no',
        })
        if (!args?.sub_category_id) {

            delete newAd?.sub_category_id
        }
        const ad = await newAd.save();
        // return ad;

        const images = await multipleUploadFile(args.images, 'ad', ad?._id, `ad-${ad?._id}`)
        const options = { new: true };
        const data = {
            images,
        }
        const edited = await AdList.findOneAndUpdate(
            { _id: ad?._id },
            data,
            options);

        return edited;
    },
};

const updateAdList = {
    type: AdListType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        category_id: { type: new GraphQLNonNull(GraphQLID) },
        sub_category_id: { type: GraphQLID },
        tags: { type: GraphQLString },
        address: { type: GraphQLString },
        province: { type: GraphQLString },
        city: { type: GraphQLString },
        age: { type: GraphQLString },
        price: { type: GraphQLInt },
        home_delivery: { type: GraphQLString },
        description: { type: GraphQLString },
        primary_phone: { type: GraphQLString },
        secondary_phone: { type: GraphQLString },
        status: { type: GraphQLString },
        allow_whatsapp_contact: { type: GraphQLBoolean },
        featured: { type: GraphQLString },
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        images: { type: new GraphQLList(GraphQLUpload) },
        imagePaths: { type: new GraphQLList(GraphQLString) },
        vaccinated: { type: GraphQLString },
    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }
        let finalImages = []

        const images = await multipleUploadFile(args.images, 'ad', args?.id, `ad-${args?.id}`)
        // finalImages = NameCorrect(args?.imagePaths);
        const newImages = args?.imagePaths?.concat(images)

        const data = {
            title: args?.title,
            category_id: args?.category_id,
            sub_category_id: args?.sub_category_id ?? '',
            province: args?.province,
            city: args?.city,
            age: args?.age,
            price: args?.price,
            home_delivery: args?.home_delivery,
            description: args?.description,
            primary_phone: args?.primary_phone,
            secondary_phone: args?.secondary_phone,
            allow_whatsapp_contact: args?.allow_whatsapp_contact ?? false,
            status: args?.status,
            featured: args?.featured,
            images: newImages,
            vaccinated: args?.vaccinated ?? 'no',
        }
        if (!args?.sub_category_id) {
            delete data?.sub_category_id
        }
        const options = { new: true };
        const ad = await AdList.findOneAndUpdate(
            { _id: args.id },
            data,
            options);

        return ad;

    },
};


const updateAdListStatus = {
    type: AdListType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: GraphQLString },

    },
    async resolve(parent, args, req) {
        //  * CHECK TOKEN

        if (!req.isAuth) {
            throw new ApolloError('Not authenticated');
        }


        const data = {
            status: args?.status,

        }

        const options = { new: true };
        const ad = await AdList.findOneAndUpdate(
            { _id: args.id },
            data,
            options);

        return ad;

    },
};


const deleteAdList = {
    type: AdListType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }
        await DeleteFile('ad', args?.id)
        const ad = await AdList.findByIdAndDelete(args.id)
        return ad;
    },
};

export {
    createAdList,
    updateAdList,
    deleteAdList,
    updateAdListStatus
}