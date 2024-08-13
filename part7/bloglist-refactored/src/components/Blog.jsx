import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  createComment,
  deleteBlog,
  updateLikeBlog,
} from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs';
import { useField } from '../hooks/useFields';
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  Link,
  Box,
} from '@mui/material';

const Blog = () => {
  const id = useParams().id;
  const [blog, setBlog] = useState(null);
  const comment = useField('text', 'comment');

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
              message: 'Success: Entry deleted',
            },
            5
          )
        );
      } catch (err) {
        dispatch(
          setNotification(
            {
              type: 'error',
              message: 'Error: Entry couldn’t be deleted',
            },
            5
          )
        );
      }
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    await dispatch(createComment(blog.id, { content: comment.value }));
  };

  return (
    <Container component="main" maxWidth="md">
      {blog && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {blog.title} <span>by {blog.author}</span>
          </Typography>
          <Typography variant="body1">
            <Link href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Likes: {blog.likes}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateLikes}
              sx={{ ml: 2 }}
            >
              Like
            </Button>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Added by {blog.user.name}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Comments
          </Typography>
          <Box component="form" onSubmit={sendComment} sx={{ mt: 2 }}>
            <TextField
              label="Comment"
              variant="outlined"
              fullWidth
              {...comment}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
            >
              Add Comment
            </Button>
          </Box>
          <List sx={{ mt: 2 }}>
            {blog.comments.map((comment) => (
              <ListItem key={comment.id}>{comment.content}</ListItem>
            ))}
          </List>
          {blog.user.name === user.name && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteBlog}
              sx={{ mt: 2 }}
            >
              Remove
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Blog;
