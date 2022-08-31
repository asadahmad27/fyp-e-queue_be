import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';
import pkg from 'graphql-iso-date';

const { GraphQLDateTime } = pkg;

// * PRIVACY POLICY TYPE
const PrivacyPolicyTypes = new GraphQLObjectType({
  name: 'PrivacyPolicy',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

export default PrivacyPolicyTypes;
