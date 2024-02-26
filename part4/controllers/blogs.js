const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post("/", middleware.userExtractor, async (request, response) => {
  const blog = new Blog(request.body);
  const user = request.user;
  console.log(user);
  blog.user = user.id;
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);
    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: "invalid token or user" });
    }
    await blog.deleteOne();
    user.blogs = user.blogs.filter((b) => b.id != blog.id);
    await user.save();
    response.status(204).end();
  },
);

blogRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const { body } = request;
  const blog = body;
  const oldBlog = await Blog.findById(request.params.id);
  if (oldBlog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: "invalid user" });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogRouter;
