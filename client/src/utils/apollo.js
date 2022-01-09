import ApolloClient from 'apollo-boost';

let auth = localStorage.getItem('authToken');

export default new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  request: async (operation) => {
    const token = auth;
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  },
});