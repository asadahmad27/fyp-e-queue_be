// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import colors from 'colors';
// import connectDB from './config/db.js';
// import { graphqlHTTP } from 'express-graphql';
// import schema from './graphql/schema/index.js';
// import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
// import isAuth from './middleware/is-auth.js';
// import cron from 'node-cron';
// import User from './models/user.js';
// import { USER_ROLES } from './constants.js';
// import isHeader from './middleware/is-headers.js';

// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import { ApolloServer } from 'apollo-server-express';




// //  * INTIALIZE  DOTENV TO LOAD VARIABLES FROM .ENV fILE
// dotenv.config();

// //  * CREATE PORT VARIABLE FROM .ENV FILE
// const port = process.env.PORT || 8000;

// //  * INITIALIZE EXPRESS
// const app = express();

// // * CONNECT DATABASE
// connectDB();

// //  * MIDDLEWARE
// var corsOptions = {
//   origin: '*',
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   accessControlAllowOrigin: '*',
//   accessControlAllowCredentials: true,
//   accessControlAllowMethods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// };
// const httpServer = createServer(app);
// const io = new Server(httpServer);
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     origin: "*",
// //     methods: ["GET", "POST"]
// //   }
// // });
// // const data = { key: "abc" }
// // io.on('connection', (socket) => {
// //   // listening to events from client
// //   socket.on('connection', (params, callback) => {

// //     // send data back to client by using ack callback
// //     callback(data)

// //     // send data back to client by using emit
// //     socket.emit('connection', data)

// //     // broadcasting data to all other connected clients
// //     socket.broadcast.emit('connection', data)
// //   })
// // })
// // app.use(isHeader);
// const maxRequestBodySize = '5mb';
// app.use(express.json({ limit: maxRequestBodySize }));
// app.use(express.urlencoded({ limit: maxRequestBodySize }));
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(isAuth);
// app.use(express.static('public'));

// //  * SETTING UP GRAPHQL
// const server = new ApolloServer({
//   schema,
//   graphiql: process.env.NODE_ENV === 'development',

//   // context: ({ req }) => {
//   //   const token = req.headers.authorization || '';
//   //   return { token };
//   // },
// });

// // app.use(
// //   '/e-queue',

// //   graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
// //   graphqlHTTP({
// //     schema,
// //     graphiql: process.env.NODE_ENV === 'development',

// //   })
// // );
// await server.start();
// server.applyMiddleware({ app });
// // * LISTENING ON PORT
// // app.listen(port, console.log(`Server is running on port ${port}`));
// // io.listen(9000)
// httpServer.listen(4000, () => {
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
//   console.log(`🚀 Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`);
// });

// io.on('connection', (socket) => {
//   console.log('A user has connected.');

//   socket.on('disconnect', () => {
//     console.log('A user has disconnected.');
//   });
// });


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
import isHeader from './middleware/is-headers.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
// import http from "http"
//  * INTIALIZE  DOTENV TO LOAD VARIABLES FROM .ENV fILE
dotenv.config();

//  * CREATE PORT VARIABLE FROM .ENV FILE
const port = process.env.PORT || 8000;

//  * INITIALIZE EXPRESS
const app = express();

// * CONNECT DATABASE
connectDB();

//  * MIDDLEWARE
var corsOptions = {
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  accessControlAllowOrigin: '*',
  accessControlAllowCredentials: true,
  accessControlAllowMethods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const httpServer = createServer(app);
// const server = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// const data = { key: "abc" }
// io.on('connection', (socket) => {
//   // listening to events from client
//   socket.on('connection', (params, callback) => {

//     // send data back to client by using ack callback
//     callback(data)

//     // send data back to client by using emit
//     socket.emit('connection', data)

//     // broadcasting data to all other connected clients
//     socket.broadcast.emit('connection', data)
//   })
// })
// app.use(isHeader);
const maxRequestBodySize = '5mb';
app.use(express.json({ limit: maxRequestBodySize }));
app.use(express.urlencoded({ limit: maxRequestBodySize }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(isAuth);
app.use(express.static('public'));

//  * SETTING UP GRAPHQL
app.use(
  '/e-queue',

  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',

  })
);

// * LISTENING ON PORT
// app.listen(port, console.log(`Server is running on port ${port}`));
// io.listen(9000)
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('User Disconnected');
  });
  socket.on('example_message', function (msg) {
    console.log('message: ' + msg);
  });
  socket.on('testing-event', function (msg) {
    console.log('message: ' + msg);
  });
  socket.on('ticket-updated', function (msg, number) {
    io.emit("current-ticket-served", "update to get updated token");

  });
  socket.on('window-status-updated', function (msg, number) {
    io.emit("window-status-changed", "update to get updated timer");

  });
});
// io.listen(8000);
httpServer.listen(8000, function () {
  console.log('listening on *:3000');
});