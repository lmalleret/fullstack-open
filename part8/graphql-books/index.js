const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
require("dotenv").config();

mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!,
      password: String!,
      favoriteGenre: String!
    ): User
    login(
      username: String!,
      password: String!
    ): Token
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    me: User
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => {
      try {
        return await Book.countDocuments({});
      } catch (error) {
        throw new GraphQLError("Failed to count books", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    authorCount: async () => {
      try {
        return await Author.countDocuments({});
      } catch (error) {
        throw new GraphQLError("Failed to count authors", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    allBooks: async (root, args) => {
      try {
        const { author, genre } = args;
        const filters = {};

        if (author) {
          const authorDoc = await Author.findOne({ name: author });
          if (!authorDoc) {
            throw new GraphQLError("Author not found", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
          filters.author = authorDoc._id;
        }

        if (genre) {
          filters.genres = genre;
        }

        const books = await Book.find(filters).populate("author");
        return books;
      } catch (error) {
        throw new GraphQLError("Failed to fetch books", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    allAuthors: async () => {
      try {
        const authors = await Author.find({});
        return Promise.all(
          authors.map(async (author) => {
            const bookCount = await Book.countDocuments({ author: author._id });
            return {
              ...author.toObject(),
              bookCount,
            };
          })
        );
      } catch (error) {
        throw new GraphQLError("Failed to fetch authors", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    me: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      return currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      try {
        const currentUser = context.currentUser;
        if (!currentUser) {
          throw new GraphQLError("Not authenticated", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        const { title, author: authorName, published, genres } = args;

        let author = await Author.findOne({ name: authorName });
        if (!author) {
          author = new Author({ name: authorName });
          await author.save();
        }

        const book = new Book({ title, published, author: author._id, genres });
        await book.save();
        return book;
      } catch (error) {
        throw new GraphQLError("Failed to add book", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    editAuthor: async (root, args, context) => {
      try {
        const currentUser = context.currentUser;
        if (!currentUser) {
          throw new GraphQLError("Not authenticated", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        const { name, setBornTo } = args;

        const author = await Author.findOneAndUpdate(
          { name },
          { born: setBornTo },
          { new: true }
        );

        if (!author) {
          throw new GraphQLError("Author not found", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        return author;
      } catch (error) {
        throw new GraphQLError("Failed to edit author", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    createUser: async (root, args) => {
      try {
        const { username, password, favoriteGenre } = args;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new GraphQLError("Username already taken", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
          username,
          password: hashedPassword,
          favoriteGenre,
        });
        await user.save();
        return user;
      } catch (error) {
        throw new GraphQLError("Failed to create user", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    login: async (root, args) => {
      try {
        const { username, password } = args;

        const user = await User.findOne({ username });
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
          throw new GraphQLError("Invalid password", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const token = jwt.sign(
          { username: user.username, id: user._id },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        return { value: token };
      } catch (error) {
        throw new GraphQLError("Failed to login", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
