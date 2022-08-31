import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import UserTypes from './user-types.js';
import User from '../../models/user.js';
const { GraphQLDateTime } = pkg;

// * PRODUCT TYPE
const ProductTypes = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    name: { type: GraphQLString },
    website: { type: GraphQLString },
    link: { type: GraphQLString },
    image: {
      type: GraphQLString,
      resolve(parent, args) {
        let imageUrl;
        if (parent.image) {
          imageUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: parent.image,
          });
        }
        return imageUrl || parent.image;
      },
    },
    about: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    user: {
      type: UserTypes,
      resolve(parent, args) {
        return User.findById(parent.user_id);
      },
    },
  }),
});

export default ProductTypes;
