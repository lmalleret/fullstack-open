const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@apollo/server/express4')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./utils/connectDB');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const { JWT_SECRET } = require('./config');

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id).populate(
            'friends'
          )
          return { currentUser }
        }
      },
    }),
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
