import { ApolloError } from 'apollo-server-errors';
import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import Feed from '../../models/feed.js';
import User from '../../models/user.js';
import FeedTypes from '../types/feed-types.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { singleFileUpload } from '../schema/s3.js';
import { FILE_KEYS } from '../../constants.js';

const createFeed = {
  type: FeedTypes,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    thumbnail: { type: new GraphQLNonNull(GraphQLUpload) },
    link: { type: new GraphQLNonNull(GraphQLString) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    const newFeed = new Feed({
      name: args.name,
      description: args.description,
      link: args.link,
      user_id: args.user_id,
    });

    const savedFeed = await newFeed.save();

    if (args?.thumbnail) {
      args.thumbnail = await singleFileUpload(
        args?.thumbnail,
        FILE_KEYS.FEED_IMAGES,
        savedFeed._id
      );
    }

    const data = {
      name: savedFeed.name,
      description: savedFeed.description,
      link: savedFeed.link,
      user_id: savedFeed.user_id,
      thumbnail: args.thumbnail,
    };
    const options = { new: true };
    const updatedFeed = await Feed.findOneAndUpdate(
      { _id: savedFeed._id },
      data,
      options
    );

    const user = await User.findOne({ _id: args.user_id });
    user.post_feed_ids.push(savedFeed._id);
    await user.save();

    const feed = await updatedFeed.save();
    return feed;
  },
};

const updateFeed = {
  type: FeedTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    link: { type: new GraphQLNonNull(GraphQLString) },
    thumbnail: { type: GraphQLUpload },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }
    if (args?.thumbnail) {
      args.thumbnail = await singleFileUpload(
        args?.thumbnail,
        FILE_KEYS.FEED_IMAGES,
        args.id
      );
    }

    const data = {
      name: args.name,
      description: args.description ?? '',
      link: args.link ?? '',
      thumbnail: args.thumbnail ?? '',
      user_id: args.user_id ?? '',
    };

    if (!args?.thumbnail) {
      delete data.thumbnail;
    }

    const options = { new: true };
    const updatedFeed = await Feed.findOneAndUpdate(
      { _id: args.id },
      data,
      options
    );
    return updatedFeed;
  },
};

const deleteFeed = {
  type: FeedTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const feed = await Feed.findByIdAndDelete(args.id);
    return feed;
  },
};

export { createFeed, updateFeed, deleteFeed };
