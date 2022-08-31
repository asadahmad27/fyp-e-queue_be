import { ApolloError } from 'apollo-server-errors';
import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import Faq from '../../models/faq.js';
import FaqTypes from '../types/faq-types.js';

const createFaq = {
  type: FaqTypes,
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const newFaq = new Faq({
      question: '',
      answer: '',
    });

    const faq = await newFaq.save();

    return faq;
  },
};

const updateFaqs = {
  type: FaqTypes,
  args: {
    faqs_array: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const faqs = args.faqs_array ? JSON.parse(args.faqs_array) : [];

    faqs.map(async (item) => {
      if (item.id) {
        const data = {
          question: item.question,
          answer: item.answer,
        };
        const options = { new: true };
        await Faq.findOneAndUpdate({ _id: item.id }, data, options);
      }
    });
  },
};

const deleteFaq = {
  type: FaqTypes,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, req) {
    // * CHECK IF TOKEN IS VALID
    if (!req.isAuth) {
      throw new ApolloError('Not authenticated');
    }

    const faq = await Faq.findByIdAndDelete(args.id);
    return faq;
  },
};

export { updateFaqs, createFaq, deleteFaq };
