import { GraphQLList, GraphQLInt } from 'graphql';
import Faq from '../../models/faq.js';
import FaqTypes from '../types/faq-types.js';

const faqs = {
  type: new GraphQLList(FaqTypes),
  resolve: (parent, args) => {
    return Faq.find();
  },
};

const faqsCount = {
  type: GraphQLInt,

  resolve(parent, args) {
    return Faq.find().count();
  },
};

export { faqs, faqsCount };
