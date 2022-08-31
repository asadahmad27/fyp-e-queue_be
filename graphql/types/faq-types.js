import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import pkg from 'graphql-iso-date';

const { GraphQLDateTime } = pkg;

// * FAQ TYPE
const FaqTypes = new GraphQLObjectType({
  name: 'Faq',
  fields: () => ({
    id: { type: GraphQLID },
    question: { type: GraphQLString },
    answer: { type: GraphQLString },
    faqs_array: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

export default FaqTypes;
