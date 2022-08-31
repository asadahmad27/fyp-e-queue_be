import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';
import pkg from 'graphql-iso-date';

const { GraphQLDateTime } = pkg;

// * TERMS AND CONDITIONS TYPE
const TermsConditionsTypes = new GraphQLObjectType({
  name: 'TermsConditions',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

export default TermsConditionsTypes;
