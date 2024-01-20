const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("unique identifier property of blog posts exists", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});
test("a valid blog can be added", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "lim",
    url: "alksdjfl",
    likes: 10,
  };
  const blogsAtStart = await helper.blogsInDb();
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((n) => n.title);
  expect(titles).toContain("async/await simplifies making async calls");
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("blog deleted", () => {
  test("correct blog deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    console.log("asdfasdf", blogToDelete);

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const title = blogsAtEnd.map((r) => r.title);
    expect(title).not.toContain(blogToDelete.title);
  });
});

describe("updating blog", () => {
  test("updated number of likes", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    blogToUpdate["likes"] = 13;
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const likes = blogsAtEnd.filter((r) => r.id === blogToUpdate.id)[0].likes;
    expect(likes).toEqual(blogToUpdate.likes);
  });
});
