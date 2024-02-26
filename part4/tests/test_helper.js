const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// const initialBlogs = async () => {
// await User.deleteMany({}); // delete any users in test db
// const passwordHash = await bcrypt.hash("sekret", 10);
// const user = new User({ username: "root", passwordHash });
// const savedUser = await user.save();
// const userid = savedUser.id;

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "Josh",
    url: "https://blog.com",
    likes: 15,
    // user: userid,
  },
  {
    title: "HTML is hard",
    author: "Joshua",
    url: "https://blog1.com",
    likes: 20,
    // user: userid,
  },
];
//   return blogs;
// };
// const nonExistingId = async () => {
//   const blog = new Blog({ content: "willremovethissoon" });
//   await blog.save();
//   await blog.deleteOne();

//   return blog._id.toString();
// };

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  console.log(blogs);
  return blogs.map((blog) => blog.toJSON());
};
const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  //   nonExistingId,
  blogsInDb,
  usersInDb,
};
