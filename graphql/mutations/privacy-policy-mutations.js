import { ApolloError } from 'apollo-server-errors';
import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import PrivacyPolicy from '../../models/privacy-policy.js';
import PrivacyPolicyTypes from '../types/privacy-policy-types.js';

const createPrivacyPolicy = {
  type: PrivacyPolicyTypes,
  args: {
    id: { type: GraphQLID },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    if (args.id) {
      const data = {
        content: args.content,
      };
      const options = { new: true };
      await PrivacyPolicy.findOneAndUpdate({ _id: args.id }, data, options);
    } else {
      const newPrivacyPolicy = new PrivacyPolicy({
        content: args.content ?? '',
      });

      const privacyPolicy = await newPrivacyPolicy.save();

      return privacyPolicy;
    }
  },
};

export { createPrivacyPolicy };
