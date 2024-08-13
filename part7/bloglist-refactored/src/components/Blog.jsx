import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteBlog, updateLikeBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs';

const Blog = () => {
  const id = useParams().id;
  const [blog, setBlog] = useState(null);
  console.log(blog);
  

  useEffect(() => {
    const fetchBlog = async () => {
      const blog = await blogService.getById(id);
      setBlog(blog);
    };
    fetchBlog();
  }, [id]);
  const dispatch = useDispatch();
  const user = JSON.parse(window.localStorage.getItem('user'));

  const handleUpdateLikes = () => {
    dispatch(updateLikeBlog(blog.id, { ...blog, likes: blog.likes + 1 }));
  };

  const handleDeleteBlog = async () => {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.user.name}`
    );
    if (confirm) {
      try {
        dispatch(deleteBlog(blog.id));
        dispatch(
          setNotification(
            {
              type: 'success',
              message: 'Success: Entrie deleted',
            },
            5
          )
        );
      } catch (err) {
        dispatch(
          setNotification(
            {
              type: 'error',
              message: 'Error: Entrie couldnt be deleted',
            },
            5
          )
        );
      }
    }
  };

  return (
    <>
      {blog && (
        <div className="blog">
          <h1>{blog.title} {blog.author}</h1>
          <p><a href={blog.url}>{blog.url}</a></p>
          <span>likes: {blog.likes} </span>
          <button onClick={handleUpdateLikes}>like</button>
          <p>added by {blog.user.name}</p>
          {blog.user.name === user.name && (
            <button onClick={handleDeleteBlog}>remove</button>
          )}
        </div>
      )}
    </>
  );
};

export default Blog;
