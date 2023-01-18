import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';
import Category from '../../models/category.js';
import CategoryType from '../types/category-type.js';
import { ApolloError } from 'apollo-server-errors';
import { USER_ROLES } from '../../constants.js';
import AdListType from '../types/ad-list-type.js';
import AdList from '../../models/ad-list.js';
import SubCategory from '../../models/sub-category.js';

const allAdList = {
    type: new GraphQLList(AdListType),
    resolve: (parent, args, req) => {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }

        return AdList.find();
    },
};

const allAdListForAdmin = {
    type: new GraphQLList(AdListType),
    args: {
        query: { type: GraphQLString }
    },
    async resolve(parent, args, req) {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }
        const regex = new RegExp(args.query, 'i');
        if (args?.query) {
            const ads = await AdList.find({ title: { $regex: regex } })
            return ads
        } else {
            const ads = await AdList.find();
            return ads
        }


    },
};
const AdsByCategory = {
    type: new GraphQLList(AdListType),
    args: {
        slug: { type: GraphQLString }
    },
    async resolve(parent, args, req) {
        // * CHECK IF TOKEN IS VALID
        // if (!req.isAuth) {
        //   throw new ApolloError('Not authenticated');
        // }
        let ads;
        const categoryData = await Category.find({ slug: args?.slug });
        const subCategoryData = await SubCategory.find({ slug: args?.slug });
        if (categoryData?.length > 0) {
            ads = await AdList.find({ category_id: categoryData[0]._id });
        } else if (subCategoryData?.length > 0) {
            ads = await AdList.find({ sub_category_id: subCategoryData[0]._id });
        } else {
            ads = []
        }


        return ads;


    },
};

const adListOnCatelog = {
    type: new GraphQLList(AdListType),
    args: {
        age: { type: GraphQLString },
        categories: { type: new GraphQLList(GraphQLString) },
        cities: { type: new GraphQLList(GraphQLString) },
        provinces: { type: new GraphQLList(GraphQLString) },
        home_delivery: { type: GraphQLString },
        max_price: { type: GraphQLInt },
        min_price: { type: GraphQLInt },
        vaccinated: { type: GraphQLString },
    },
    async resolve(parent, args, req) {
        // * CHECK IF TOKEN IS VALID

        // const queryData = {
        //     province: args?.provinces,
        //     city: args?.cities,
        //     home_delivery: args?.home_delivery,
        //     vaccinated: args?.vaccinated,
        //     price: { $gte: args?.min_price, $lte: args?.max_price }
        // };

        // console.log(queryData)
        // const ads = await adList.find({ $where: queryData })
        console.log(args)
        const ads = await AdList.find(

            // {
            //     $and: [
            {
                $and: [

                    // { province: { $in: args?.provinces } },
                    { city: { $in: args?.cities } },
                    // { home_delivery: args?.home_delivery },
                    // { vaccinated: args?.vaccinated },
                    { price: { $gte: args?.min_price, $lte: args?.max_price } },
                ]
            }
            //     ],
            // }
        )

        return ads

    },
};
const adList = {
    type: AdListType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        increaseViewCount: { type: GraphQLString }

    },
    async resolve(parent, args, req) {

        const ad = await AdList.findById(args.id);

        if (args?.increaseViewCount == "true") {

            const data = {
                views: ad?.views + 1
            }
            const options = { new: true };
            const increasedViewCount = await AdList.findOneAndUpdate(
                { _id: ad?._id },
                data,
                options);

            return increasedViewCount
        } else {
            return ad;
        }

    },
};

export {
    allAdList,
    adList,
    allAdListForAdmin,
    adListOnCatelog,
    AdsByCategory
}