import { ApolloError } from 'apollo-server-errors';
import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import Product from '../../models/product.js';
import ProductTypes from '../types/product-types.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { singleFileUpload } from '../schema/s3.js';
import { FILE_KEYS } from '../../constants.js';

const createProduct = {
  type: ProductTypes,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    website: { type: new GraphQLNonNull(GraphQLString) },
    about: { type: new GraphQLNonNull(GraphQLString) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    image: { type: new GraphQLNonNull(GraphQLUpload) },
    link: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    const newProduct = new Product({
      name: args.name,
      website: args.website,
      about: args.about,
      user_id: args.user_id,
      link: args.link,
    });

    const savedProduct = await newProduct.save();

    if (args?.image) {
      args.image = await singleFileUpload(
        args?.image,
        FILE_KEYS.PRODUCT_IMAGES,
        savedProduct._id
      );
    }

    const data = {
      name: savedProduct.name,
      website: savedProduct.website,
      about: savedProduct.about,
      image: args.image,
      link: savedProduct.link,
      user_id: savedProduct.user_id,
    };
    const options = { new: true };
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: savedProduct._id },
      data,
      options
    );

    const product = await updatedProduct.save();
    return product;
  },
};

const updateProduct = {
  type: ProductTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    website: { type: new GraphQLNonNull(GraphQLString) },
    link: { type: new GraphQLNonNull(GraphQLString) },
    about: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLUpload },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    if (args?.image) {
      args.image = await singleFileUpload(
        args?.image,
        FILE_KEYS.PRODUCT_IMAGES,
        args.id
      );
    }

    const data = {
      name: args.name,
      website: args.phone ?? '',
      about: args.country ?? '',
      image: args.image ?? '',
      user_id: args.user_id ?? '',
      link: args.link ?? '',
    };

    if (!args?.image) {
      delete data.image;
    }

    const options = { new: true };
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: args.id },
      data,
      options
    );
    return updatedProduct;
  },
};

const deleteProduct = {
  type: ProductTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const product = await Product.findByIdAndDelete(args.id);
    return product;
  },
};

export { createProduct, updateProduct, deleteProduct };
