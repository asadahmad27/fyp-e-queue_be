import { ApolloError } from 'apollo-server-errors';
import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import TermsConditions from '../../models/terms-conditions.js';
import TermsConditionsTypes from '../types/terms-conditions-types.js';

const createTermsConditions = {
  type: TermsConditionsTypes,
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
      await TermsConditions.findOneAndUpdate({ _id: args.id }, data, options);
    } else {
      const newTermsConditions = new TermsConditions({
        content: args.content ?? '',
      });

      const termsCondition = await newTermsConditions.save();

      return termsCondition;
    }
  },
};

export { createTermsConditions };
