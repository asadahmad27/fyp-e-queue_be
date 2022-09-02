import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import Product from '../../models/product.js';
import ProductTypes from '../types/product-types.js';
import { ApolloError } from 'apollo-server-errors';
import User from '../../models/user.js';
import { USER_ROLES } from '../../constants.js';

const products = {
  type: new GraphQLList(ProductTypes),
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    // if (!req.isAuth) {
    //   throw new ApolloError('Not authenticated');
    // }

    const user = await User.findById(args.user_id);

    if (user?.role === USER_ROLES.USER)
      return Product.find({ user_id: args.user_id });
    return Product.find();
  },
};

const productsBySearch = {
  type: new GraphQLList(ProductTypes),
  args: {
    query: { type: GraphQLString },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    const regex = new RegExp(args.query, 'i')
    const product = Product.find({ name: { $regex: regex } });
    return product;
  },
};

const product = {
  type: ProductTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve(parent, args) {
    return Product.findById(args.id);
  },
};

const productsCount = {
  type: GraphQLInt,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args) {
    const user = await User.findById(args.user_id);

    if (user?.role === USER_ROLES.USER)
      return Product.find({ user_id: args.user_id }).count();
    return Product.find().count();
  },
};

export { products, product, productsCount, productsBySearch };
