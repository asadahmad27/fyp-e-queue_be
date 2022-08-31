import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import User from '../../models/user.js';
import UserType from '../types/user-types.js';
import { ApolloError } from 'apollo-server-errors';

const users = {
  type: new GraphQLList(UserType),
  resolve: (parent, args, req) => {
    // * CHECK IF TOKEN IS VALID
    // if (!req.isAuth) {
    //   throw new ApolloError('Not authenticated');
    // }
    return User.find();
  },
};

const user = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve(parent, args) {
    return User.findById(args.id);
  },
};

const usersCount = {
  type: GraphQLInt,

  resolve(parent, args) {
    return User.find().count();
  },
};

export { users, user, usersCount };
