const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors= require('cors');


const app = express();

const typeDefs = require('./Api/typeDefs');
const resolvers = require('./Api/resolvers');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type ,Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use(cors());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true
});
// server.express.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:7777');
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept'
//     );
//     next();
//   });
server.applyMiddleware({app});
app.use("/images", express.static(__dirname + '/images'));


mongoose.connect(
    process.env.mongoURI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
      }
  ).then(() => console.log("DB Connected"));
  mongoose.connection.on("error", err => {
    console.log(`DB Connection Error: ${err.message}`);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});
