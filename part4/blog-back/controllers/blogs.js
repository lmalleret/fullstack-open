const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  return response.json(blogs);
});

blogsRouter.get("/:id", (request, response, next) => {
  const id = request.params.id;
  Blog.findById(id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;
  const user = request.user;
  const blog = await Blog.findById(id);

  if (blog.user.toString() === user.id.toString()) {
    const blogDeleted = await Blog.findByIdAndDelete(id);
    return response.status(204).send();
  } else {
    return response.status(401).send();
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await Blog.findById(savedBlog._id).populate("user", {
    username: 1,
    name: 1,
  });

  response.status(201).json(populatedBlog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;
  const blogDeleted = await Blog.findByIdAndDelete(id);
  return response.status(204).send();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const id = request.params.id;
  const { likes } = request.body;

  const blogUpdated = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true, runValidators: true, context: "query" }
  );

  return response.json(blogUpdated);
});

module.exports = blogsRouter;
