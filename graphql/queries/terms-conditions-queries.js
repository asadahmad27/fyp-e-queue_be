import { GraphQLList } from 'graphql';
import TermsConditions from '../../models/terms-conditions.js';
import TermsConditionsTypes from '../types/terms-conditions-types.js';

const termsConditions = {
  type: new GraphQLList(TermsConditionsTypes),
  resolve: (parent, args, req) => {
    return TermsConditions.find();
  },
};

export { termsConditions };
