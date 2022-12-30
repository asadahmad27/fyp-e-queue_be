import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
const { GraphQLDateTime } = pkg;

// * Category TYPE
const AdListType = new GraphQLObjectType({
    name: 'AdList',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        category: { type: GraphQLID },
        subCategory: { type: GraphQLID },
        subCategory_details: { type: GraphQLID },
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

        // images: {
        //     type: new GraphQLList(GraphQLString),
        //     // resolve(parent, args) {
        //     //   let imageUrl;
        //     //   if (parent.logo) {
        //     //     imageUrl = s3.getSignedUrl('getObject', {
        //     //       Bucket: process.env.S3_BUCKET,
        //     //       Key: parent.logo,
        //     //     });
        //     //   }
        //     //   return imageUrl || parent.logo;
        //     // },
        // },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});

export default AdListType;