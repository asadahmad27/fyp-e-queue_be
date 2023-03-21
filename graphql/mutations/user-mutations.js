import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-errors';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLID,
} from 'graphql';
import User from '../../models/user.js';
import UserType from '../types/user-types.js';
import { USER_ROLES, SUSPENDED, USER_STATUS } from '../../constants.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import AdList from '../../models/ad-list.js';

import { uploadFile } from '../schema/local-file-upload.js';

import Category from '../../models/category.js';
import Window from '../../models/window.js';

const register = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    // email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    org_id: { type: new GraphQLNonNull(GraphQLID) }
  },
  async resolve(parent, args) {
    //  * CHECK IF USER EXISTS
    const userExist = await User.findOne({ phone: args.phone });
    if (userExist) {
      throw new ApolloError('User already exists');
    }

    //  * HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.password, salt);

    const newUser = new User({
      name: args.name,
      // email: "N/A",
      password: hashedPassword,
      phone: args.phone,
      role: USER_ROLES.USER,
      org_id: args?.org_id
      // status: args.status
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
    phone: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    //  * CHECK IF USER EXISTS
    const user = await User.findOne({ phone: args.phone });

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


const empRegister = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    org_id: { type: GraphQLID },
    role: {
      type: new GraphQLEnumType({
        name: 'EmpRole',
        values: {
          admin: { value: USER_ROLES.ADMIN },
          employ: { value: USER_ROLES.EMPLOY },
        },
      }),
      defaultValue: USER_ROLES.EMPLOY,
    },
  },
  async resolve(parent, args) {
    //  * CHECK IF USER EXISTS
    const userExist = await User.findOne({ email: args.email });
    if (userExist) {
      throw new ApolloError('Employ already exists');
    }

    //  * HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.password, salt);

    const newUser = new User({
      name: args.name,
      email: args.email,
      password: hashedPassword,
      phone: args?.phone ?? '',
      role: args?.role ?? USER_ROLES.EMPLOY,
      org_id: args?.org_id
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

const addAdmin = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    org_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args) {
    //  * CHECK IF USER EXISTS
    const userExist = await User.findOne({ email: args.email });
    if (userExist) {
      throw new ApolloError('Admin already exists');
    }

    //  * HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.password, salt);

    const newUser = new User({
      name: args.name,
      email: args.email,
      password: hashedPassword,
      // phone: args.phone ?? '',
      role: USER_ROLES.ADMIN,
      org_id: args?.org_id
    });

    // // * CREATE AND ASSIGN TOKEN
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

const empLogin = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    //  * CHECK IF USER EXISTS
    const user = await User.findOne({ email: args.email });

    if (!user) {
      throw new ApolloError('Employe does not exist');
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

    if (user?.role === USER_ROLES.ADMIN) {
      const total_windows = await Window.find({ org_id: user?.org_id }).count();;
      const total_employees = await User.find({ org_id: user?.org_id, role: USER_ROLES.EMPLOY }).count();
      const total_customers = await User.find({ org_id: user?.org_id, role: USER_ROLES.USER }).count();
      user.total_windows = total_windows,
        user.total_employees = total_employees,
        user.total_customers = total_customers
    }

    console.log(user)
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

const changePassword = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    new_password: { type: new GraphQLNonNull(GraphQLString) },
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.new_password, salt);
    const options = { new: true };
    await User.findOneAndUpdate(
      { _id: args.id },
      { password: hashedPassword },
      options
    );


    return user;
  },
};

const updateAddress = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    address: { type: new GraphQLNonNull(GraphQLString) },

  },
  async resolve(parent, args) {


    const options = { new: true };
    const user = await User.findOneAndUpdate(
      { _id: args.id },
      { address: args?.address },
      options
    );


    return user;
  },
};

const updateUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    new_password: { type: GraphQLString },
    phone: { type: GraphQLString },
    org_id: { type: GraphQLID },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    let hashedPassword;
    if (args.new_password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(args.new_password, salt);
    }

    const data = {
      name: args.name,
      email: args.email,
      password: hashedPassword,
      phone: args?.phone ?? '',
      org_id: args?.org_id
    };

    if (!args?.new_password) {
      delete data.password;
    }


    const options = { new: true };
    const updatedUser = await User.findOneAndUpdate(
      { _id: args.id },
      data,
      options
    );

    // * CREATE AND ASSIGN TOKEN
    const token = jwt.sign(
      { _id: updatedUser._id, role: updatedUser.role },
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    );
    updatedUser.token = token;
    updatedUser.token_expirtation = 1;

    const user = await updatedUser.save();
    return user;
  },
};
const updateAdmin = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
    new_password: { type: GraphQLString },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    let hashedPassword;
    if (args.new_password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(args.new_password, salt);
    }

    const data = {
      name: args.name,
      email: args.email ?? '',
      password: hashedPassword
    };

    if (!args?.new_password) {
      delete data.password;
    }

    const options = { new: true };
    const updatedUser = await User.findOneAndUpdate(
      { _id: args.id },
      data,
      options
    );

    // * CREATE AND ASSIGN TOKEN
    const token = jwt.sign(
      { _id: updatedUser._id, role: updatedUser.role },
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    );
    updatedUser.token = token;
    updatedUser.token_expirtation = 1;

    const user = await updatedUser.save();
    return user;
  },
};
const updateAdminEmail = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLString },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }


    const data = {
      email: args.email ?? '',
    };

    const options = { new: true };
    const updatedUser = await User.findOneAndUpdate(
      { _id: args.id },
      data,
      options
    );

    // * CREATE AND ASSIGN TOKEN
    const token = jwt.sign(
      { _id: updatedUser._id, role: updatedUser.role },
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    );
    updatedUser.token = token;
    updatedUser.token_expirtation = 1;

    const user = await updatedUser.save();
    return user;
  },
};


const imageTest = {
  type: UserType,
  args: {
    image: { type: GraphQLUpload }
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    // if (!req.isAuth) {
    //   throw new ApolloError('Not authenticated');
    // }

    console.log(args.image, cc)

  },
};

// export default function createFileUploadServer(config) {
//   const app = express();
//   const upload = multer({ dest: path.resolve(__dirname, os.tmpdir()) });
//   const server = (http.Server as any)(app);
//   app.post(config.path, upload.single(config.fieldName), (req, res, next) => {
//     res.send(req.file);
//   });

//   return server;
// }


const deleteUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    // await DeleteFile('profile', args?.id)
    const user = await User.findByIdAndDelete(args.id);
    return user;
  },
};
const deleteEmp = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    // await DeleteFile('profile', args?.id)
    const user = await User.findByIdAndDelete(args.id);
    return user;
  },
};

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
  updateUser,
  deleteUser,
  changePassword,
  imageTest,
  updateAddress,
  empRegister,
  empLogin,
  addAdmin,
  updateAdmin,
  updateAdminEmail,
  deleteEmp
  // deleteUser,
  // followUser,
  // verifyUser,
  // suspendUser,
  // SendUserMsgOnLogin,
  // totalReviewsAllowed,
};
