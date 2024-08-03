const mongoose = require("mongoose");
const config = require("./utils/config");

if (process.argv.length < 5) {
  console.log("missing arguments");
  process.exit(1);
}

const password = process.argv[2];
const title = process.argv[3];
const author = process.argv[4];
const url = process.argv[5];
const likes = process.argv[6];

const _url = `mongodb+srv://lmalleret99:${password}@cluster0.woqbe4j.mongodb.net/testBlogApp?retryWrites=true&w=majority&appName=Cluster0`


mongoose.set("strictQuery", false);

mongoose.connect(_url);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

if (process.argv.length > 3) {
  const blog = new Blog({
    title,
    author,
    url,
    likes,
  });
  blog.save().then((result) => {
    console.log(`added ${title} to DB`);
    mongoose.connection.close();
  });
} else {
  Blog.find({}).then((blogs) => {
    console.log("Blog list:");
    blogs.map((b) => console.log(b.title, b.author, b.url, b.likes));
    mongoose.connection.close();
  });
}
