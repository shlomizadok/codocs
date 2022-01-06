# Welcome to NEAR (Node, Express, Apollo, React)

**This is a very early release and a work in progress. untested atm**

This project is a an attempt to create a skeleton that would help building apps with React and Graphql.

The server side is Express with Apollo (which is persisting the data to MongoDB)\
The client side was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Connecting to MongoDB

Graphql will try to read and write to a local instance of MongoDB. (see [server/graphql/schema.js](https://github.com/shlomizadok/near/blob/master/server/graphql/schema.js#L35))\
To quickly add MongoDB via docker:\
`docker run -p 27017:27017 --name near-mongo -d mongo`\
This will create a container and an exposed mongodb port which is now accessible via `localhost:27017`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the client and the server in the development mode.\
The client will open [http://localhost:3000](http://localhost:3000) to view it in your browser.\
The page will reload when you make changes.\
You may also see any lint errors in the console.

The server (graphql) will open in [http://localhost:4000/graphql](http://localhost:4000/graphql).\
The server loads in watch mode with nodemon - this is to help debugging & hot reloading.

### `yarn start:web`

Will launch only the client in development mode.

### `yarn start:server`

Will launch only the graphql server

### `yarn watch:server`

Will launch only the graphql server with nodemon. Extremely useful when trying to debug and hot reload.



