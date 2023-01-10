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
    GraphQLInt
} from 'graphql';
import AdListType from '../types/ad-list-type.js';
import AdList from '../../models/ad-list.js';
import randomstring from 'randomstring';
import slugify from 'slugify';
import { AD_STATUS } from '../../constants.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { multipleUploadFile, multipleUploadFileSingled, NameCorrect } from '../schema/local-file-upload.js';

const createAdList = {
    type: AdListType,
    args: {
        title: { type: GraphQLString },
        category_id: { type: new GraphQLNonNull(GraphQLID) },
        subCategory_id: { type: new GraphQLNonNull(GraphQLID) },
        subCategory_details_id: { type: new GraphQLNonNull(GraphQLID) },
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
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        images: { type: new GraphQLList(GraphQLUpload) },
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
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }
        const slug = `${slugify(args?.title, { lower: true })}-${randomstring.generate(12).toLowerCase()}`;
        const newAd = new AdList({
            title: args?.title,
            slug,
            category_id: args?.category_id,
            subCategory_id: args?.subCategory_id,
            subCategory_details_id: args?.subCategory_details_id,
            subCategory_types: args?.subCategory_types,
            province: args?.province,
            city: args?.city,
            age: args?.age,
            price: args?.price,
            home_delivery: args?.home_delivery,
            description: args?.description,
            primary_phone: args?.primary_phone,
            secondary_phone: args?.secondary_phone,
            allow_whatsapp_contact: args?.allow_whatsapp_contact ?? false,
            user_id: args?.user_id,
            status: args?.status ?? AD_STATUS.ACTIVE,
            featured: args?.featured
        })

        const ad = await newAd.save();

        const images = await multipleUploadFile(args.images, `ad-${ad?._id}`)
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
        subCategory_id: { type: new GraphQLNonNull(GraphQLID) },
        subCategory_details_id: { type: new GraphQLNonNull(GraphQLID) },
        subCategory_types: { type: GraphQLString },
        province: { type: GraphQLString },
        city: { type: GraphQLString },
        age: { type: GraphQLString },
        price: { type: GraphQLString },
        home_delivery: { type: GraphQLString },
        description: { type: GraphQLString },
        primary_phone: { type: GraphQLString },
        secondary_phone: { type: GraphQLString },
        status: { type: GraphQLString },
        allow_whatsapp_contact: { type: GraphQLBoolean },
        featured: { type: GraphQLString },
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        images: { type: new GraphQLList(GraphQLUpload) },
        previousImagesNumber: { type: GraphQLInt },
        imagePaths: { type: new GraphQLList(GraphQLString) }
    },
    async resolve(parent, args) {
        //  * CHECK TOKEN

        // if (!req.isAuth) {
        //     throw new ApolloError('Not authenticated');
        //   }
        let finalImages = []

        const images = await multipleUploadFile(args.images, `ad-${args?.id}`)
            .then((res) => {
                console.log(res, "res", finalImages)
                finalImages = NameCorrect([...res, ...args?.imagePaths]);
                const data = {
                    title: args?.title,
                    category_id: args?.category_id,
                    subCategory_id: args?.subCategory_id,
                    subCategory_details_id: args?.subCategory_details_id,
                    subCategory_types: args?.subCategory_types,
                    province: args?.province,
                    city: args?.city,
                    age: args?.age,
                    price: args?.price,
                    home_delivery: args?.home_delivery,
                    description: args?.description,
                    primary_phone: args?.primary_phone,
                    secondary_phone: args?.secondary_phone,
                    allow_whatsapp_contact: args?.allow_whatsapp_contact ?? boolean,
                    status: args?.status,
                    featured: args?.featured,
                    images: finalImages,
                }
                const ad = updateFunc(data)
                return ad

            })
            .catch(err => console.log(err))

        console.log('---->', args.images, images, finalImages)

    },
};

const updateFunc = async (data) => {
    const options = { new: true };
    const ad = await AdList.findOneAndUpdate(
        { _id: args.id },
        data,
        options);

    return ad;
}

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