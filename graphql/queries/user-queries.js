import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import User from '../../models/user.js';
import UserType from '../types/user-types.js';
import { ApolloError } from 'apollo-server-errors';
import { AD_STATUS, USER_ROLES } from '../../constants.js';
import AdList from '../../models/ad-list.js';

const users = {
  type: new GraphQLList(UserType),
  resolve: (parent, args, req) => {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    return User.find({ role: USER_ROLES.USER });
  },
};

const user = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    // limit: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    let user = await User.findById(args.id);
    // user.total_ads = (await AdList.find({ user_id: user?._id })).length;
    // user.ads_sold = (await AdList.find({ user_id: user?._id, status: AD_STATUS.SOLD })).length;
    return user

  },
};

const allEmploys = {
  type: new GraphQLList(UserType),
  args: {
    org_id: { type: new GraphQLNonNull(GraphQLID) },
    // limit: { type: GraphQLInt },
  },
  resolve: (parent, args, req) => {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    return User.find({ role: USER_ROLES.EMPLOY, org_id: args?.org_id });
  },
};


// const userForAdmin = {
//   type: UserType,
//   args: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     limit: { type: GraphQLInt },
//   },
//   resolve(parent, args) {
//     return User.findById(args.id);
//   },
// };

// const usersCount = {
//   type: GraphQLInt,

//   resolve(parent, args) {
//     return User.find().count();
//   },
// };

export { users, user, allEmploys };
