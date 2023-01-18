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
import UserType from './user-types.js';
import User from '../../models/user.js';
import Category from '../../models/category.js';
import CategoryType from './category-type.js';
import AdList from '../../models/ad-list.js';
import { SubCategoryType } from './sub-category-type.js';
import SubCategory from '../../models/sub-category.js';
const { GraphQLDateTime } = pkg;

// * Category TYPE
const AdListType = new GraphQLObjectType({
    name: 'AdList',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        slug: { type: GraphQLString },
        category_id: { type: GraphQLID },
        sub_category_id: { type: GraphQLID },
        user_id: { type: GraphQLID },
        province: { type: GraphQLString },
        city: { type: GraphQLString },
        address: { type: GraphQLString },
        age: { type: GraphQLString },
        price: { type: GraphQLInt },
        home_delivery: { type: GraphQLString },
        description: { type: GraphQLString },
        primary_phone: { type: GraphQLString },
        secondary_phone: { type: GraphQLString },
        featured: { type: GraphQLString },
        status: { type: GraphQLString },
        vaccinated: { type: GraphQLString },
        allow_whatsapp_contact: { type: GraphQLBoolean },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user_id);
            },
        },
        category: {
            type: CategoryType,
            resolve(parent, args) {
                return Category.findById(parent.category_id);
            },
        },
        subCategory: {
            type: SubCategoryType,
            resolve(parent, args) {
                return SubCategory.findById(parent.sub_category_id);
            },
        },
        // similar_ads: {
        //     type: new GraphQLList(AdListType),
        //     resolve(parent, args) {
        //       return AdList.find({
        //         category:  parent.category ,
        //         tag_list: new RegExp(args.name, 'i');,
        //         
        //       });
        //     },
        //   },

        images: {
            type: new GraphQLList(GraphQLString),
        },
        imagePaths: {
            type: new GraphQLList(GraphQLString),
        },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        views: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },
        tags: { type: new GraphQLList(TagsType) },
    }),
});



const TagsType = new GraphQLObjectType({
    name: 'tags',
    fields: () => ({
        key: { type: GraphQLString },
        value: { type: GraphQLString },
    }),
});

export default AdListType;