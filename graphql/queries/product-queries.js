import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import Product from '../../models/product.js';
import ProductTypes from '../types/product-types.js';
import { ApolloError } from 'apollo-server-errors';

const products = {
  type: new GraphQLList(ProductTypes),
  resolve: (parent, args, req) => {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    return Product.find();
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

const productByUserID = {
  type: new GraphQLList(ProductTypes),
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve() {
    return Product.find({ user_id: args.user_id });
  },
};

const productsCount = {
  type: GraphQLInt,
  resolve(parent, args) {
    return Product.find().count();
  },
};

export { products, product, productByUserID, productsCount };
