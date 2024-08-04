const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../models/user");
const app = require("../app");

const api = supertest(app);

let userObject = new User({
  username: "luchanga321",
  name: "luciano malleret",
  password: "malleret99",
});

beforeEach(async () => {
  await User.deleteMany({});
  await api.post("/api/users").send(userObject);
});

test("inserting user with missing fields", async () => {
  let newUser = {
    username: "rickSanchez",
    name: "Rick Sanchez",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  newUser = {
    name: "Rick Sanchez",
    password: "ricksanchez89",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("inserting user that already exist", async () => {
  await api
    .post("/api/users")
    .send(userObject)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});
