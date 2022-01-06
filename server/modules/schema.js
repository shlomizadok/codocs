
const { makeExecutableSchema } = require('graphql-tools');
const docResolvers = require('./docResolvers');
const blockResolvers = require('./blockResolvers');
const spaceResolvers = require('./spaceResolvers');
const userResolvers = require('./userResolvers');
const typeDefs = require('./typeDefs');

const resolvers = [
  spaceResolvers,
  userResolvers,
  docResolvers,
  blockResolvers
];

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;