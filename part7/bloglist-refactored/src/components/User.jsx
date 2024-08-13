import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/users';

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
    <>
      {user && (
        <>
          <h2>{user.name}</h2>
          <h3>added blogs</h3>
          <ul>
            {user.blogs.map((blog) => (
              <li key={blog.id}>{blog.title}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default User;
