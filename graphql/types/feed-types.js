import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';

const { GraphQLDateTime } = pkg;

// * FEED TYPE
const FeedTypes = new GraphQLObjectType({
  name: 'Feed',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    link: { type: GraphQLString },
    user_id: { type: GraphQLID },
    thumbnail: {
      type: GraphQLString,
      resolve(parent, args) {
        let imageUrl;
        if (parent.thumbnail) {
          imageUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: parent.thumbnail,
          });
        }
        return imageUrl || parent.thumbnail;
      },
    },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

export default FeedTypes;
