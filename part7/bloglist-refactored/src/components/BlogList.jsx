import { useRef } from 'react';
import Blog from './Blog';
import NewBlogForm from './NewBlogForm';
import Notification from './Notification';
import Togglable from './Toggable';
import { Link } from 'react-router-dom';
import { Typography, Button, Container, Box } from '@mui/material';

function BlogList({ blogs, notification }) {
  const blogFormRef = useRef();

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Blogs
        </Typography>
        <Notification notification={notification} />
        <Togglable
          buttonShowLabel="New Blog"
          buttonHideLabel="Cancel"
          ref={blogFormRef}
        >
          <NewBlogForm />
        </Togglable>

        <Box sx={{ mt: 3 }}>
          {blogs.map((blog) => (
            <Box key={blog.id} sx={{ mb: 2 }}>
              <Button
                component={Link}
                to={`/blogs/${blog.id}`}
                variant="text"
                sx={{ textAlign: 'left' }}
              >
                {blog.title}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default BlogList;
