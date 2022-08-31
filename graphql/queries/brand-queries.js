import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import Brand from '../../models/brand.js';
import BrandTypes from '../types/brand-types.js';
import { ApolloError } from 'apollo-server-errors';

const brands = {
  type: new GraphQLList(BrandTypes),
  resolve: (parent, args, req) => {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    return Brand.find();
  },
};

const brand = {
  type: BrandTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve(parent, args) {
    return Brand.findById(args.id);
  },
};

const brandByUserID = {
  type: new GraphQLList(BrandTypes),
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve() {
    return Brand.find({ user_id: args.user_id });
  },
};

const brandsCount = {
  type: GraphQLInt,
  resolve(parent, args) {
    return Brand.find().count();
  },
};

export { brands, brand, brandByUserID, brandsCount };
