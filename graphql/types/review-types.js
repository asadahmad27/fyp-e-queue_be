import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';

import pkg from 'graphql-iso-date';

const { GraphQLDateTime } = pkg;

// * REVIEW TYPE
const ReviewTypes = new GraphQLObjectType({
  name: 'Review',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

export default ReviewTypes;
