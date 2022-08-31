import { GraphQLList } from 'graphql';
import PrivacyPolicy from '../../models/privacy-policy.js';
import PrivacyPolicyTypes from '../types/privacy-policy-types.js';

const privacyPolicy = {
  type: new GraphQLList(PrivacyPolicyTypes),
  resolve: (parent, args, req) => {
    return PrivacyPolicy.find();
  },
};

export { privacyPolicy };
