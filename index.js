import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import connectDB from './config/db.js';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema/index.js';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import isAuth from './middleware/is-auth.js';
import cron from 'node-cron';
import User from './models/user.js';
import { USER_ROLES } from './constants.js';
//  * INTIALIZE  DOTENV TO LOAD VARIABLES FROM .ENV fILE
dotenv.config();

//  * CREATE PORT VARIABLE FROM .ENV FILE
const port = process.env.PORT || 8000;

//  * INITIALIZE EXPRESS
const app = express();

// * CONNECT DATABASE
connectDB();

//  * RESET REVIEWS DONE COUNT TO = 0 EVERY MIDNIGHT
cron.schedule('0 0 * * *', () => {
  User.find({ role: USER_ROLES.USER }).then((users) => {
    users.forEach((user) => {
      user.total_reviews_done = 0;
      user.save();
    });
  });
});

//  * MIDDLEWARE
const maxRequestBodySize = '5mb';
app.use(express.json({ limit: maxRequestBodySize }));
app.use(express.urlencoded({ limit: maxRequestBodySize }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(isAuth);

//  * SETTING UP GRAPHQL
app.use(
  '/petvet',
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',

  })
);

// * LISTENING ON PORT
app.listen(port, console.log(`Server is running on port ${port}`));
