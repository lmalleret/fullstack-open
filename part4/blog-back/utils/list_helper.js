const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favoriteBlog = (blogs) => {
  let maxLikes = 0;
  let blogWithMaxLikes = null;
  blogs.forEach((blog) => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      blogWithMaxLikes = blog;
    }
  });
  return {
    title: blogWithMaxLikes.title,
    author: blogWithMaxLikes.author,
    likes: maxLikes,
  };
};

const mostBlogs = (blogs) => {
  let blogMap = new Map();

  blogs.forEach((blog) => {
    if (blogMap.has(blog.author)) {
      blogMap.set(blog.author, blogMap.get(blog.author) + 1);
    } else {
      blogMap.set(blog.author, 1);
    }
  });

  const maxBlogs = Math.max(...blogMap.values());

  const entriesArray = Array.from(blogMap.entries());

  const authorWithMostBlogs = entriesArray.find(
    (entry) => entry[1] === maxBlogs
  );

  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1],
  };
};

const mostLikes = (blogs) => {
  let likesMap = new Map();

  blogs.forEach((blog) => {
    if (likesMap.has(blog.author)) {
        likesMap.set(blog.author, likesMap.get(blog.author) + blog.likes);
    } else {
        likesMap.set(blog.author, blog.likes);
    }
  });

  const maxLikes = Math.max(...likesMap.values());

  const entriesArray = Array.from(likesMap.entries());

  const authorWithMostLikes = entriesArray.find(
    (entry) => entry[1] === maxLikes
  );

  return {
    author: authorWithMostLikes[0],
    likes: authorWithMostLikes[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
