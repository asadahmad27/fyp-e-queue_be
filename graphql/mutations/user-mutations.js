import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLID,
  GraphQLBoolean,
} from 'graphql';
import User from '../../models/user.js';
import UserType from '../types/user-types.js';
import { USER_ROLES, FILE_KEYS } from '../../constants.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { singleFileUpload } from '../schema/s3.js';

const register = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    role: {
      type: new GraphQLEnumType({
        name: 'UserStatus',
        values: {
          author: { value: USER_ROLES.AUTHOR },
          admin: { value: USER_ROLES.ADMIN },
        },
      }),
      defaultValue: USER_ROLES?.AUTHOR,
    },
  },
  async resolve(parent, args) {
    //  * CHECK IF USER EXISTS
    const userExist = await User.findOne({ email: args.email });
    if (userExist) {
      throw new ApolloError('User already exists');
    }

    //  * HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.password, salt);

    const newUser = new User({
      name: args.name,
      email: args.email,
      password: hashedPassword,
      role: args.role,
    });

    // * CREATE AND ASSIGN TOKEN
    const token = jwt.sign(
      { _id: newUser._id, role: newUser.role },
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    );
    newUser.token = token;
    newUser.token_expirtation = 1;

    const user = await newUser.save();

    return user;
  },
};

const login = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    //  * CHECK IF USER EXISTS
    const user = await User.findOne({ email: args.email });

    if (!user) {
      throw new ApolloError('User does not exist');
    }
    //   * COMPARE HASHED PASSWORD
    const isMatch = await bcrypt.compare(args.password, user.password);
    if (!isMatch) {
      throw new ApolloError('Password is incorrect');
    }

    // * CREATE AND ASSIGN TOKEN
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    );
    user.token = token;
    user.token_expirtation = 1;

    return user;
  },
};

const emailConfirmation = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    //  * CHECK EMAIL EXISTS
    const user = await User.findOne({ email: args.email });
    if (!user) {
      throw new ApolloError('User does not exist');
    }
    const message = 'Email has been sent to your mail for password recovery';
    user.message = message;
    return user;
  },
};

const resetPassword = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    new_password: { type: new GraphQLNonNull(GraphQLString) },
    confirm_password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    // * CHECK IF USER EXISTS
    const user = await User.findOne({ _id: args.id });
    if (!user) {
      throw new ApolloError('User does not exist');
    }

    //   * COMPARE HASHED PASSWORD
    const isMatch = await bcrypt.compare(args.password, user.password);
    if (!isMatch) {
      throw new ApolloError('Old Password is incorrect');
    }

    //  * CHECK IS NEW PASSWORD MATCHES WITH CONFIRM PASSWORD
    if (args.new_password !== args.confirm_password) {
      throw new ApolloError('New Password does not match');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.new_password, salt);
    const options = { new: true };
    await User.findOneAndUpdate(
      { _id: args.id },
      { password: hashedPassword },
      options
    );
    const message = 'Password has been changed successfully';
    user.message = message;

    return user;
  },
};

const updateUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    last_name: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    profile_pic: { type: GraphQLUpload },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    if (args?.profile_pic) {
      args.profile_pic = await singleFileUpload(
        args?.profile_pic,
        FILE_KEYS.PROFILE_PICS,
        args.id
      );
    }

    const data = {
      name: args.name,
      phone: args.phone ?? '',
      country: args.country ?? '',
      city: args.city ?? '',
      last_name: args.last_name ?? '',
      user_name: args.user_name ?? '',
      profile_pic: args.profile_pic ?? '',
    };

    if (!args?.profile_pic) {
      delete data.profile_pic;
    }

    const options = { new: true };
    const user = await User.findOneAndUpdate({ _id: args.id }, data, options);
    return user;
  },
};

export { register, login, emailConfirmation, resetPassword, updateUser };
