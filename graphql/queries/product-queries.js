import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import Product from '../../models/product.js';
import Brand from '../../models/brand.js';
import ProductTypes from '../types/product-types.js';
import SearchTypes from '../types/search-types.js';
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
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const user = await User.findById(args.user_id);

    if (user?.role === USER_ROLES.USER)
      return Product.find({ user_id: args.user_id });
    return Product.find();
  },
};

const productsBySearch = {
  type: new GraphQLList(SearchTypes),
  args: {
    query: { type: GraphQLString },
    limit: { type: GraphQLInt },
  },
  async resolve(parent, args, req) {
    const DEFAULT_LIMIT = 10;
    const regex = new RegExp(args.query, 'i');

    let data;

    if (args.query) {
      const products = await Product.find({ name: { $regex: regex } })
        .skip(args.limit)
        .limit(DEFAULT_LIMIT);
      const brands = await Brand.find({ name: { $regex: regex } })
        .skip(args.limit)
        .limit(DEFAULT_LIMIT);
      data = [...products, ...brands];

      return data;
    } else {
      const products = await Product.find()
        .skip(args.limit)
        .limit(DEFAULT_LIMIT);
      const brands = await Brand.find().skip(args.limit).limit(DEFAULT_LIMIT);
      data = [...products, ...brands];
      return data;
    }
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

const recentProducts = {
  type: new GraphQLList(ProductTypes),
  async resolve(parent, args) {
    return Product.find({ reviews_count: { $gt: 0 } })
      .sort({ timestamp: -1 })
      .limit(10);
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

export { products, product, productsCount, recentProducts, productsBySearch };
