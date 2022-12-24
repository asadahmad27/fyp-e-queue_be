import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import User from '../../models/user.js';
import UserType from '../types/user-types.js';
import { USER_ROLES, FILE_KEYS, SUSPENDED } from '../../constants.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { singleFileUpload } from '../schema/s3.js';

const register = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    role: {
      type: new GraphQLEnumType({
        name: 'UserStatus',
        values: {
          author: { value: USER_ROLES.USER },
          admin: { value: USER_ROLES.ADMIN },
        },
      }),
      defaultValue: USER_ROLES.USER,
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

    if (user.suspended) {
      throw new ApolloError(SUSPENDED);
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

// const emailConfirmation = {
//   type: UserType,
//   args: {
//     email: { type: new GraphQLNonNull(GraphQLString) },
//   },
//   async resolve(parent, args) {
//     //  * CHECK EMAIL EXISTS
//     const user = await User.findOne({ email: args.email });
//     if (!user) {
//       throw new ApolloError('User does not exist');
//     }
//     const message = 'Email has been sent to your mail for password recovery';
//     user.message = message;
//     return user;
//   },
// };

// const resetPassword = {
//   type: UserType,
//   args: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     password: { type: new GraphQLNonNull(GraphQLString) },
//     new_password: { type: new GraphQLNonNull(GraphQLString) },
//     confirm_password: { type: new GraphQLNonNull(GraphQLString) },
//   },
//   async resolve(parent, args) {
//     // * CHECK IF USER EXISTS
//     const user = await User.findOne({ _id: args.id });
//     if (!user) {
//       throw new ApolloError('User does not exist');
//     }

//     //   * COMPARE HASHED PASSWORD
//     const isMatch = await bcrypt.compare(args.password, user.password);
//     if (!isMatch) {
//       throw new ApolloError('Old Password is incorrect');
//     }

//     //  * CHECK IS NEW PASSWORD MATCHES WITH CONFIRM PASSWORD
//     if (args.new_password !== args.confirm_password) {
//       throw new ApolloError('New Password does not match');
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(args.new_password, salt);
//     const options = { new: true };
//     await User.findOneAndUpdate(
//       { _id: args.id },
//       { password: hashedPassword },
//       options
//     );
//     const message = 'Password has been changed successfully';
//     user.message = message;

//     return user;
//   },
// };

// const updateUser = {
//   type: UserType,
//   args: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     name: { type: new GraphQLNonNull(GraphQLString) },
//     last_name: { type: GraphQLString },
//     country: { type: GraphQLString },
//     city: { type: GraphQLString },
//     phone: { type: GraphQLString },
//     social_links: { type: GraphQLString },
//     profile_pic: { type: GraphQLUpload },
//     about: { type: GraphQLString },
//     new_password: { type: GraphQLString },
//   },
//   async resolve(parent, args, req) {
//     // * CHECK IF TOKEN IS VALID
//     if (!req.isAuth) {
//       throw new ApolloError('Not authenticated');
//     }

//     if (args?.profile_pic) {
//       args.profile_pic = await singleFileUpload(
//         args?.profile_pic,
//         FILE_KEYS.PROFILE_PICS,
//         args.id
//       );
//     }

//     let hashedPassword;
//     if (args.new_password) {
//       const salt = await bcrypt.genSalt(10);
//       hashedPassword = await bcrypt.hash(args.new_password, salt);
//     }

//     const data = {
//       name: args.name,
//       phone: args.phone ?? '',
//       country: args.country ?? '',
//       city: args.city ?? '',
//       last_name: args.last_name ?? '',
//       user_name: args.user_name ?? '',
//       profile_pic: args.profile_pic ?? '',
//       social_links: JSON.parse(args.social_links) ?? {},
//       about: args.about ?? '',
//       password: hashedPassword,
//     };

//     if (!args?.profile_pic) {
//       delete data.profile_pic;
//     }
//     if (!args?.new_password) {
//       delete data.password;
//     }

//     const options = { new: true };
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: args.id },
//       data,
//       options
//     );

//     // * CREATE AND ASSIGN TOKEN
//     const token = jwt.sign(
//       { _id: updatedUser._id, role: updatedUser.role },
//       process.env.TOKEN_SECRET,
//       { expiresIn: '24h' }
//     );
//     updatedUser.token = token;
//     updatedUser.token_expirtation = 1;

//     const user = await updatedUser.save();
//     return user;
//   },
// };

// const deleteUser = {
//   type: UserType,
//   args: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//   },
//   async resolve(parent, args, req) {
//     // * CHECK IF TOKEN IS VALID
//     if (!req.isAuth) {
//       throw new ApolloError('Not authenticated');
//     }

//     //  * DELETE BRANDS
//     Brand.find({ user_id: args.id }).then((brands) => {
//       brands.forEach((brand) => {
//         //  * DELETE BRAND REVIEWS
//         Review.find({ brand_id: brand._id }).then((reviews) => {
//           reviews.forEach((review) => {
//             review.remove();
//           });
//         });
//         //  * DELETE PRODUCTS
//         Product.find({ brand_id: brand._id }).then((products) => {
//           products.forEach((product) => {
//             //  * DELETE PRODUCT REVIEWS
//             Review.find({ product_id: product._id }).then((reviews) => {
//               reviews.forEach((review) => {
//                 review.remove();
//               });
//             });

//             product.remove();
//           });
//         });
//         brand.remove();
//       });
//     });

//     const user = await User.findByIdAndDelete(args.id);
//     return user;
//   },
// };

// const followUser = {
//   type: UserType,
//   args: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     follower_id: { type: new GraphQLNonNull(GraphQLID) },
//   },
//   async resolve(parent, args) {
//     //ading id to the list of user who is currnetly login
//     const currentUser = await User.findOne({ _id: args.id });
//     if (currentUser.following_ids.includes(args.follower_id)) {
//       let ind = currentUser.following_ids.indexOf(args.follower_id);
//       currentUser.following_ids.splice(ind, 1);
//     } else {
//       currentUser.following_ids.push(args.follower_id);
//     }

//     currentUser.save();

//     const currentDisplayUser = await User.findOne({ _id: args.follower_id });
//     if (currentDisplayUser.follower_ids.includes(args.id)) {
//       let ind = currentDisplayUser.follower_ids.indexOf(args.id);
//       currentDisplayUser.follower_ids.splice(ind, 1);
//     } else {
//       currentDisplayUser.follower_ids.push(args.id);
//     }

//     currentDisplayUser.save();
//     const newCurrentUser = await User.findOne({ _id: args.id });
//     return newCurrentUser;
//   },
// };

// const verifyUser = {
//   type: UserType,
//   args: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     status: { type: GraphQLBoolean },
//   },

//   async resolve(parent, args) {
//     const options = { new: true };
//     const updateUser = await User.findOneAndUpdate(
//       { _id: args.id },
//       { verified: args.status },
//       options
//     );
//     return updateUser;
//   },
// };

// const suspendUser = {
//   type: UserType,
//   args: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     status: { type: GraphQLBoolean },
//   },

//   async resolve(parent, args) {
//     const options = { new: true };
//     const updateUser = await User.findOneAndUpdate(
//       { _id: args.id },
//       { suspended: args.status },
//       options
//     );
//     return updateUser;
//   },
// };

// const SendUserMsgOnLogin = {
//   type: UserType,
//   args: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     status: { type: GraphQLBoolean },
//   },

//   async resolve(parent, args) {
//     const options = { new: true };
//     const updateUser = await User.findOneAndUpdate(
//       { _id: args.id },
//       { send_msg_on_login: args.status },
//       options
//     );
//     return updateUser;
//   },
// };

// const totalReviewsAllowed = {
//   type: UserType,
//   args: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     count: { type: GraphQLInt },
//   },

//   async resolve(parent, args) {
//     const options = { new: true };
//     const updateUser = await User.findOneAndUpdate(
//       { _id: args.id },
//       { total_reviews_allowed: args.count },
//       options
//     );
//     return updateUser;
//   },
// };

export {
  register,
  login,
  // emailConfirmation,
  // resetPassword,
  // updateUser,
  // deleteUser,
  // followUser,
  // verifyUser,
  // suspendUser,
  // SendUserMsgOnLogin,
  // totalReviewsAllowed,
};
