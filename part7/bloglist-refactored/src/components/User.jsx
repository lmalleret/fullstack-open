import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/users';
import { Container, Typography, List, ListItem, Box } from '@mui/material';

function User() {
  const id = useParams().id;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userService.getUserById(id);
      setUser(users);
    };
    fetchUsers();
  }, [id]);

  return (
    <Container component="main" maxWidth="md">
      {user && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Added Blogs
          </Typography>
          <List>
            {user.blogs.map((blog) => (
              <ListItem key={blog.id}>{blog.title}</ListItem>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
}

export default User;
