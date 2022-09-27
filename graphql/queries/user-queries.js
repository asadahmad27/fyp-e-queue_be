import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import User from '../../models/user.js';
import UserType from '../types/user-types.js';
import { ApolloError } from 'apollo-server-errors';
import { USER_ROLES } from '../../constants.js';

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
    limit: { type: GraphQLInt },
  },
  resolve(parent, args) {
    return User.findById(args.id);
  },
};

const userForAdmin = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    limit: { type: GraphQLInt },
  },
  resolve(parent, args) {
    console.log(limit)
    return User.findById(args.id);
  },
};

const usersCount = {
  type: GraphQLInt,

  resolve(parent, args) {
    return User.find().count();
  },
};

export { users, user, usersCount, userForAdmin };
