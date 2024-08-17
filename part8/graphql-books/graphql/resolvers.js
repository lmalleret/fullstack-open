const { GraphQLError } = require('graphql');
const Author = require('../models/author');
const Book = require('../models/book');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pubsub } = require('../utils/pubsub');
const { JWT_SECRET } = require('../config');

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments({}),
    authorCount: async () => Author.countDocuments({}),
    allBooks: async (root, args) => {
      const { author, genre } = args;
      const filters = {};
      
      if (author) {
        const authorDoc = await Author.findOne({ name: author });
        if (!authorDoc) throw new GraphQLError('Author not found');
        filters.author = authorDoc._id;
      }

      if (genre) filters.genres = genre;

      return Book.find(filters).populate('author');
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      return Promise.all(authors.map(async author => {
        const bookCount = await Book.countDocuments({ author: author._id });
        return { ...author.toObject(), bookCount };
      }));
    },
    me: (root, args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const { title, author: authorName, published, genres } = args;
      let author = await Author.findOne({ name: authorName });
      if (!author) {
        author = new Author({ name: authorName });
        await author.save();
      }

      const book = new Book({ title, published, author: author._id, genres });
      await book.save();
      pubsub.publish('BOOK_ADDED', { bookAdded: book });
      return book;
    },
    editAuthor: async (root, args, context) => {
      const { name, setBornTo } = args;
      return Author.findOneAndUpdate({ name }, { born: setBornTo }, { new: true });
    },
    createUser: async (root, args) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(args.password, saltRounds);

      const user = new User({ username: args.username, password: hashedPassword, favoriteGenre: args.favoriteGenre });
      return user.save();
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || !await bcrypt.compare(args.password, user.password)) throw new GraphQLError('Invalid credentials');
      
      const token = jwt.sign({ username: user.username, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      return { value: token };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
};

module.exports = resolvers;
