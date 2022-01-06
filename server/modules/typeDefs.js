const { buildASTSchema } = require('graphql'); 
const gql = require('graphql-tag');

// Types are dependent, so they all live in one file.
// Trying too organise by Objects, Query, Mutations, Input.
const spaceTypeDefs = buildASTSchema(gql`
  type Space {
    _id: ID
    name: String
    public: Boolean
    subSpaces: [Space]
    docs: [Doc]
  }

  type Doc {
    _id: ID
    title: String
    content: String
    space: Space
    space_id: String
    blocks: [Block]
  }

  type Block {
    _id: ID
    order: Int
    content: String
    contentType: String
    doc: Doc
    doc_id: String
  }

  type User {
    _id: ID
    externalId: String
    externalProvider: String
    name: String
    email: String
    picture: String
  }

  type Query {
    spaces: [Space]
    space(_id: ID!): Space
    docs: [Doc]
    doc(_id: ID!): Doc
    blocks: [Block]
    block(_id: ID!): Block
    users: [User]
    user(_id: ID!): User
  }

  type Mutation {
    submitDoc(input: DocInput!): Doc
    submitSpace(input: SpaceInput!): Space
    submitUser(input: UserInput!): User
    submitBlock(input: BlockInput!): Block
  }

  input BlockInput {
    _id: ID
    order: Int!
    content: String
    contentType: String!
    doc_id: String
  }
  
  input DocInput {
    _id: ID
    title: String!
    content: String
    space_id: String
  }  

  input DocSpace {
    _id: ID
  }
  
  input SpaceInput {
    _id: ID
    name: String!
    public: Boolean!
    docs: DocInput
    subSpaces: SpaceInput
  }
  
  input UserInput {
    _id: ID
    externalId: String
    externalProvider: String
    name: String!
    email: String!
    picture: String!
  }  
`);

module.exports = spaceTypeDefs;