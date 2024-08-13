import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../reducers/userReducer';

function Menu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };
  return (
    <>
      <div style={{ display: 'flex', gap: "10px" }}>
        <Link to="/blogs">blogs</Link>
        <Link to="/users">users</Link>
        {user && (
          <>
            <span>{user.name} logged in</span>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </div>
    </>
  );
}

export default Menu;
