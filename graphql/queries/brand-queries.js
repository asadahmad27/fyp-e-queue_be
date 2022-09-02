import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import Brand from '../../models/brand.js';
import BrandTypes from '../types/brand-types.js';
import { ApolloError } from 'apollo-server-errors';
import User from '../../models/user.js';
import { USER_ROLES } from '../../constants.js';

const brands = {
  type: new GraphQLList(BrandTypes),
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
      return Brand.find({ user_id: args.user_id });
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

const brandsCount = {
  type: GraphQLInt,
  args: {
    user_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args) {
    const user = await User.findById(args.user_id);

    if (user?.role === USER_ROLES.USER)
      return Brand.find({ user_id: args.user_id }).count();
    return Brand.find().count();
  },
};

export { brands, brand, brandsCount };
