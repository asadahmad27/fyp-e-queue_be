import { ApolloError } from 'apollo-server-errors';
import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import Brand from '../../models/brand.js';
import Review from '../../models/review.js';
import Product from '../../models/product.js';
import BrandTypes from '../types/brand-types.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { singleFileUpload } from '../schema/s3.js';
import { FILE_KEYS } from '../../constants.js';

const createBrand = {
  type: BrandTypes,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    website: { type: new GraphQLNonNull(GraphQLString) },
    about: { type: new GraphQLNonNull(GraphQLString) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    logo: { type: new GraphQLNonNull(GraphQLUpload) },
    social_links: { type: GraphQLString },
    slogan: { type: GraphQLString },

  },
  async resolve(parent, args, req) {
    console.log(args)
    // * CHECK IF TOKEN IS VALID
    // if (!req.isAuth) {
    //   throw new ApolloError('Not authenticated');
    // }
    // const newBrand = new Brand({
    //   name: args.name,
    //   website: args.website,
    //   about: args.about,
    //   user_id: args.user_id,
    //   // social_links: {},
    //   slogan: args.slogan ?? "",
    // });

    // const savedBrand = await newBrand.save();

    // if (args?.logo) {
    //   args.logo = await singleFileUpload(
    //     args?.logo,
    //     FILE_KEYS.BRAND_LOGO,
    //     savedBrand._id
    //   );
    // }

    // const data = {
    //   name: savedBrand.name,
    //   website: savedBrand.website,
    //   about: savedBrand.about,
    //   logo: args.logo,
    //   user_id: savedBrand.user_id,
    //   // social_links: savedBrand.social_links,
    //   slogan: savedBrand.slogan
    // };
    // const options = { new: true };
    // const updatedBrand = await Brand.findOneAndUpdate(
    //   { _id: savedBrand._id },
    //   data,
    //   options
    // );

    // const brand = await updatedBrand.save();
    // return brand;
  },
};

const updateBrand = {
  type: BrandTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    slogan: { type: GraphQLString },
    website: { type: new GraphQLNonNull(GraphQLString) },
    about: { type: new GraphQLNonNull(GraphQLString) },
    logo: { type: GraphQLUpload },
    social_links: { type: GraphQLString },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    if (args?.logo) {
      args.logo = await singleFileUpload(
        args?.logo,
        FILE_KEYS.BRAND_LOGO,
        args.id
      );
    }

    const data = {
      name: args.name,
      website: args.website ?? '',
      about: args.about ?? '',
      logo: args.logo ?? '',
      user_id: args.user_id ?? '',
      social_links: JSON.parse(args.social_links) ?? {},
      slogan: args.slogan ?? "",
    };

    if (!args?.logo) {
      delete data.logo;
    }

    const options = { new: true };
    const updatedBrand = await Brand.findOneAndUpdate(
      { _id: args.id },
      data,
      options
    );
    return updatedBrand;
  },
};

const deleteBrand = {
  type: BrandTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    //  * DELETE BRANDS
    Brand.findOne({ _id: args.id }).then((brand) => {
      //  * DELETE BRAND REVIEWS
      Review.find({ brand_id: brand._id }).then((reviews) => {
        reviews.forEach((review) => {
          review.remove();
        });
      });
      //  * DELETE PRODUCTS
      Product.find({ brand_id: brand._id }).then((products) => {
        products.forEach((product) => {
          //  * DELETE PRODUCT REVIEWS
          Review.find({ product_id: product._id }).then((reviews) => {
            reviews.forEach((review) => {
              review.remove();
            });
          });

          product.remove();
        });
      });
    });

    const brand = await Brand.findByIdAndDelete(args.id);
    return brand;
  },
};

export { createBrand, updateBrand, deleteBrand };
