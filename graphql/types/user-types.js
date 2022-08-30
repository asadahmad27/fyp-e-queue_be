import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
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
    country: { type: GraphQLString },
    city: { type: GraphQLString },
    last_name: { type: GraphQLString },
    password: { type: GraphQLString },
    new_password: { type: GraphQLString },
    confirm_password: { type: GraphQLString },
    role: { type: GraphQLString },
    personal_feeds: { type: new GraphQLList(FeedType) },
    about: { type: GraphQLString },
    social_links: { type: SocialType },
    profile_pic: {
      type: GraphQLString,

      resolve(parent, args) {
        let imageUrl;
        if (parent.profile_pic) {
          imageUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: parent.profile_pic,
          });
        }
        return imageUrl || parent.profile_pic;
      },
    },
    token: { type: GraphQLString },
    token_expirtation: { type: GraphQLInt },
    message: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

const FeedType = new GraphQLObjectType({
  name: 'Feed',
  fields: () => ({
    link: { type: GraphQLString },
  }),
});
const SocialType = new GraphQLObjectType({
  name: 'Social',
  fields: () => ({
    facebook: { type: GraphQLString },
    twitter: { type: GraphQLString },
    instagram: { type: GraphQLString },
    linkedin: { type: GraphQLString },
    youtube: { type: GraphQLString },
    telegram: { type: GraphQLString },
    soundcloud: { type: GraphQLString },
    spotify: { type: GraphQLString },
    vkontakte: { type: GraphQLString },
  }),
});

export { SocialType, FeedType };

export default UserType;
