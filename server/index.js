// Assuming here that we start the server from upper directory with "yarn watch:server"
require('dotenv').config({path: './server/.env'}); 
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./modules/schema');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const getUser = async (token) => {
  console.log('token;', token);
  token = token.replace("Bearer ", '');
  const ticket = await client.verifyIdToken({
    idToken: token,
  });
  const payload = ticket.getPayload();
  return payload;
}

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP((request) => {
  return {
    schema,
    graphiql: true,
    context: () => {
      
      const token = request.headers.authorization || '';
   
      // Try to retrieve a user with the token
      const user = getUser(token);
      console.log("User:.....", user)
      if (!user) throw new AuthenticationError('you must be logged in');
   
      // Add the user to the context
      return { user };
    },
  };
}

));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
