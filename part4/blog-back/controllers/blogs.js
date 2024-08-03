const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
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

blogsRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  Blog.findByIdAndDelete(id)
    .then(() => response.status(204).send())
    .catch((error) => next(error));
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
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
