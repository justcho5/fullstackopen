const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, { likes }) => sum + likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs) return {};
  return blogs.reduce((max, game) => (max.likes > game.likes ? max : game));
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
