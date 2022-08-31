import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';

import pkg from 'graphql-iso-date';

const { GraphQLDateTime } = pkg;

// * FEED TYPE
const FeedTypes = new GraphQLObjectType({
  name: 'Feed',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

export default FeedTypes;
