import React, { useRef } from "react";
import Togglable from "./Toggable";
import blogService from "../services/blogs";

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [likes, setLikes] = React.useState(blog.likes);
  const [deleteBlog, setDeleteBlog] = React.useState(false);
  const blogRef = useRef();
  const user = JSON.parse(window.localStorage.getItem("user"));

  const handleUpdateLikes = () => {
    blogService.update(blog.id, { ...blog, likes: likes + 1 });
    const newLikeCount = likes + 1;
    setLikes(newLikeCount);
  };

  const handleDeleteBlog = async () => {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.user.name}`
    );
    if (confirm) {
      await blogService.deleteBlog(blog.id);
      setDeleteBlog(true);
    }
  };

  return (
    <>
      {!deleteBlog && (
        <div className="blog" style={blogStyle}>
          {blog.title} {blog.author}
          <Togglable
            buttonShowLabel="show"
            buttonHideLabel="hide"
            ref={blogRef}
          >
            <p>{blog.url}</p>
            <span>likes: {likes}</span>
            <button onClick={handleUpdateLikes}>like</button>
            <p>{blog.user.name}</p>
            {blog.user.name === user.name && (
              <button onClick={handleDeleteBlog}>remove</button>
            )}
          </Togglable>
        </div>
      )}
    </>
  );
};

export default Blog;
