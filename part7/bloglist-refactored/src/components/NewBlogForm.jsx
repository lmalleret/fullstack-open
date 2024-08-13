import React from 'react';
import { useField } from '../hooks/useFields';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

function NewBlogForm() {
  const title = useField('text', 'title');
  const author = useField('text', 'author');
  const url = useField('text', 'url');
  const dispatch = useDispatch();

  const submitNewBlog = (event) => {
    event.preventDefault();
    try {
      dispatch(
        createBlog({ title: title.value, author: author.value, url: url.value })
      );
      event.target.value = '';
      title.onChange(event);
      author.onChange(event);
      url.onChange(event);
      dispatch(
        setNotification(
          {
            type: 'success',
            message: 'Success: Entry created',
          },
          5
        )
      );
    } catch (err) {
      dispatch(
        setNotification(
          {
            type: 'error',
            message: 'Error: Entry could not be created',
          },
          5
        )
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New Entry
        </Typography>
        <Box component="form" onSubmit={submitNewBlog} sx={{ mt: 2 }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            {...title}
          />
          <TextField
            label="Author"
            variant="outlined"
            fullWidth
            margin="normal"
            {...author}
          />
          <TextField
            label="URL"
            variant="outlined"
            fullWidth
            margin="normal"
            {...url}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default NewBlogForm;
