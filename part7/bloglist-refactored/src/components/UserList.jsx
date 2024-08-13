import { useEffect, useState } from 'react';
import userService from '../services/users';
import { Link } from 'react-router-dom';

function UserList({ blogs }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userService.getAllUsers();
      setUsers(users);
    };
    fetchUsers();
  }, []);

  users;

  return (
    <>
      <h2>Users</h2>
      {users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default UserList;
