const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const app = require("../app");

const api = supertest(app);

const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

let token = null;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  // Crea un nuevo usuario
  const user = new User({
    username: "luchanga321",
    name: "luciano malleret",
    passwordHash: await bcrypt.hash("malleret99", 10), // Asegúrate de tener bcrypt importado
  });

  await user.save();

  // Obtén el token de autenticación
  const response = await api.post("/api/login").send({
    username: "luchanga321",
    password: "malleret99",
  });
  token = response.body.token;

  // Agrega los blogs a la base de datos
  for (let blog of blogs) {
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(201); // Asegúrate de que el blog se crea correctamente
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs identifier name is id", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  const objKeysList = Object.keys(response.body[0]);

  assert.strictEqual(objKeysList.includes("id"), true);
  assert.strictEqual(objKeysList.includes("_id"), false);
});

test("blogs post to DB", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Luciano Malleret",
    url: "https://fullstackopen.com/es/part4/probando_el_backend#mas-pruebas-y-refactorizacion-del-backend",
    likes: 8,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  const contents = response.body.map((r) => r.title);

  assert.strictEqual(response.body.length, blogs.length + 1);
  assert(contents.includes("async/await simplifies making async calls"));
});

test("blogs post to DB with invalid auth", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Luciano Malleret",
    url: "https://fullstackopen.com/es/part4/probando_el_backend#mas-pruebas-y-refactorizacion-del-backend",
    likes: 8,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", "Bearer invalidtoken")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);
});

test("likes 0 by default", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Luciano Malleret",
    url: "https://fullstackopen.com/es/part4/probando_el_backend#mas-pruebas-y-refactorizacion-del-backend",
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  const contents = response.body.map((r) => r.title);

  assert.strictEqual(response.body.length, blogs.length + 1);
  assert(contents.includes("async/await simplifies making async calls"));
});

test("missing blog properties", async () => {
  const newBlog = {};

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  assert.strictEqual(response.body.length, blogs.length);
});

test("deleting blog from DB", async () => {
  const blogsAtStart = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  const blogToDelete = blogsAtStart.body[0];
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);
  const blogAtEnd = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  assert.strictEqual(blogAtEnd.body.length, blogs.length - 1);
});

test("updating blog from DB", async () => {
  const blogsAtStart = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  const blogToUpdate = blogsAtStart.body[0];
  const newBlog = { ...blogToUpdate, likes: 5 };
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(200);
  const blogAtEnd = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  assert.strictEqual(
    blogAtEnd.body.find((b) => b.id === blogToUpdate.id).likes,
    5
  );
});

test(`there are ${blogs.length} blogs`, async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  assert.strictEqual(response.body.length, blogs.length);
});

test("the first blog is about React patterns", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  const contents = response.body.map((e) => e.title);
  assert.strictEqual(contents.includes("React patterns"), true);
});

after(async () => {
  await mongoose.connection.close();
});
