const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "Josh",
    url: "https://blog.com",
    likes: 15,
  },
  {
    title: "HTML is hard",
    author: "Joshua",
    url: "https://blog1.com",
    likes: 20,
  },
];

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

module.exports = {
  initialBlogs,
  //   nonExistingId,
  blogsInDb,
};
