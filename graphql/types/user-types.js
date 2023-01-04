import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
const { GraphQLDateTime } = pkg;

// * USER TYPE
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    province: { type: GraphQLString },
    city: { type: GraphQLString },
    last_name: { type: GraphQLString },
    password: { type: GraphQLString },
    new_password: { type: GraphQLString },
    about: { type: GraphQLString },
    role: { type: GraphQLString },
    status: { type: GraphQLString },

    profile_pic: {
      type: GraphQLString,

      // resolve(parent, args) {
      //   let imageUrl;
      //   if (parent.profile_pic) {
      //     imageUrl = s3.getSignedUrl('getObject', {
      //       Bucket: process.env.S3_BUCKET,
      //       Key: parent.profile_pic,
      //     });
      //   }
      //   return imageUrl || parent.profile_pic;
      // },
    },
    token: { type: GraphQLString },
    token_expirtation: { type: GraphQLInt },

    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    // post_feed_ids: { type: new GraphQLList(GraphQLID) },
    // follower_ids: { type: new GraphQLList(GraphQLID) },
    // following_ids: { type: new GraphQLList(GraphQLID) },
    // reviews_ids: { type: new GraphQLList(GraphQLID) },
    // verified: { type: GraphQLBoolean },
    // suspended: { type: GraphQLBoolean },
    // send_msg_on_login: { type: GraphQLBoolean },
    // total_reviews_allowed: { type: GraphQLInt },
    // total_reviews_done: { type: GraphQLInt },
    // recent_reviews_feed: {
    //   type: new GraphQLList(ReviewTypes),
    //   resolve(parent, args) {
    //     return Review.find({ user_id: { $in: parent.following_ids } })
    //       .limit(10)
    //       .sort({ timeStamp: -1 });
    //   },
    // },
    // feeds: {
    //   type: new GraphQLList(FeedTypes),
    //   resolve(parent, args) {
    //     return Feed.find({ user_id: { $in: parent.id } });
    //   },
    // },
    // reviews: {
    //   type: new GraphQLList(ReviewTypes),
    //   args: {
    //     limit: { type: GraphQLInt },
    //   },
    //   async resolve(parent, args) {
    //     const user = await User.findById(parent.id);
    //     if (user?.role === USER_ROLES.USER)
    //       return Review.find({ user_id: parent.id });
    //     return Review.find();
    //   },
    // },
    // brands: {
    //   type: new GraphQLList(BrandTypes),
    //   async resolve(parent, args) {
    //     const user = await User.findById(parent.id);

    //     if (user?.role === USER_ROLES.USER)
    //       return Brand.find({ user_id: parent.id });
    //     return Brand.find();
    //   },
    // },
    // products: {
    //   type: new GraphQLList(ProductTypes),
    //   async resolve(parent, args) {
    //     const user = await User.findById(parent.id);

    //     if (user?.role === USER_ROLES.USER)
    //       return Product.find({ user_id: parent.id });
    //     return Product.find();
    //   },
    // },

    // users: {
    //   type: new GraphQLList(UserTypes),
    //   resolve(parent, args) {
    //     return User.find();
    //   },
    // },
    // reviews_stat: {
    //   type: new GraphQLList(GraphQLFloat),
    //   async resolve(parent, args) {
    //     const reviews = await Review.find({ user_id: parent.id });
    //     const ratings = reviews?.map((review) => review.rating);
    //     return ratings;
    //   },
    // },
  }),
});

// const SocialType = new GraphQLObjectType({
//   name: 'Social',
//   fields: () => ({
//     facebook: { type: GraphQLString },
//     twitter: { type: GraphQLString },
//     instagram: { type: GraphQLString },
//     linkedin: { type: GraphQLString },
//     youtube: { type: GraphQLString },
//     telegram: { type: GraphQLString },
//     soundcloud: { type: GraphQLString },
//     spotify: { type: GraphQLString },
//     vkontakte: { type: GraphQLString },
//   }),
// });

// export { SocialType };

export default UserType;
