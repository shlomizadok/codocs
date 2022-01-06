import gql from 'graphql-tag';
// Docs gqls
export const GET_DOC = gql`
  query GetDoc($id: ID!) {
    doc(_id: $id) {
      _id
      title
      content
      space {
        name
      }
      blocks {
        _id
        order
        content
        contentType
      }
    }
  }
`;

export const SUBMIT_DOC = gql`
  mutation SubmitDoc($input: DocInput!) {
    submitDoc(input: $input) {
      _id
    }
  }
`;

// Spaces gqls
export const GET_SPACES = gql`
  query GetSpaces {
    spaces {
      _id
      name
      docs {
        _id
        title
      }
    }
  }
`;

export const GET_SPACE = gql`
query GetSpace($id: ID!) {
  space(_id: $id) {
    _id
    name
    docs {
      _id
      title
    }
  }
}
`;

export const SUBMIT_SPACE = gql`
  mutation SubmitSpace($input: SpaceInput!) {
    submitSpace(input: $input) {
      _id
    }
  }
`;