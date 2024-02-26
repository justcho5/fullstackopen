const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash, blogs: [] });
  const savedUser = await user.save();
  const userid = savedUser.id;
  const blogs = helper.initialBlogs.map((b) => ({ ...b, user: userid }));
  const savedBlogs = await Blog.insertMany(blogs);
  user.blogs = user.blogs.concat(...savedBlogs.map((b) => b.id));

  console.log(user);
  await user.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  console.log(response.body);
  const blogs = helper.initialBlogs;
  expect(response.body).toHaveLength(blogs.length);
});

test("unique identifier property of blog posts exists", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});
describe("User needed actions", () => {
  let token;
  let userid;
  const newBlog = {
    title: "blog 5",
    author: "blog author",
    url: "https://blogurl.com",
    likes: 5,
  };
  beforeEach(async () => {
    userid = (await User.find({})).filter((u) => u.username === "root")[0].id;
    const response = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });
    token = response.body.token;
  });

  test("blog creation succeeds with valid user/token", async () => {
    const responseBlog = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(responseBlog.body.user).toEqual(userid);
    const response = await api.get("/api/users");
    const users = response.body;
    const user = users.filter((u) => u.username === "root")[0];
    expect(user.blogs.map((b) => b.title)).toContain("blog 5");
    // post with token
  });

  test("blog creation fails without token", async () => {
    // post without token
    const blogsAtStart = await helper.blogsInDb();

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtStart).toHaveLength(blogsAtEnd.length);
  });

  test("blog deletion succeeds with token and correct blog deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const blogResponse = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const title = blogsAtEnd.map((r) => r.title);
    expect(title).not.toContain(blogToDelete.title);

    // blog deleted from user account
    const usersResponse = await api.get("/api/users");

    const user = usersResponse.body.filter((u) => u.username === "root")[0];
    expect(user.blogs).toHaveLength(blogsAtEnd.length);
  });
  test("blog deletion unsuccessful without token", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const blogResponse = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

    const title = blogsAtEnd.map((r) => r.title);
    expect(title).toContain(blogToDelete.title);

    // blog deleted from user account
    const usersResponse = await api.get("/api/users");

    const user = usersResponse.body.filter((u) => u.username === "root")[0];
    expect(user.blogs).toHaveLength(blogsAtEnd.length);
  });
  test("updated number of likes", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    blogToUpdate["likes"] = 13123124;
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(blogToUpdate);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const likes = blogsAtEnd.filter((r) => r.id === blogToUpdate.id)[0].likes;
    expect(likes).toEqual(blogToUpdate.likes);

    const usersResponse = await api.get("/api/users");

    const user = usersResponse.body.filter((u) => u.username === "root")[0];
    expect(user.blogs).toHaveLength(blogsAtEnd.length);

    expect(user.blogs.map((b) => b.id)).toContain(blogToUpdate.id);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
