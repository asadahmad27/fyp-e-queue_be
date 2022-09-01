import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import UserTypes from './user-types.js';
import User from '../../models/user.js';
import Product from '../../models/product.js';
import ProductTypes from './product-types.js';

const { GraphQLDateTime } = pkg;

// * BRAND TYPE
const BrandTypes = new GraphQLObjectType({
  name: 'Brand',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    name: { type: GraphQLString },
    website: { type: GraphQLString },
    logo: {
      type: GraphQLString,
      resolve(parent, args) {
        let imageUrl;
        if (parent.logo) {
          imageUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: parent.logo,
          });
        }
        return imageUrl || parent.logo;
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
    products: {
      type: new GraphQLList(ProductTypes),
      resolve(parent, args) {
        return Product.find({ brand_id: parent.id });
      },
    },
  }),
});

export default BrandTypes;
