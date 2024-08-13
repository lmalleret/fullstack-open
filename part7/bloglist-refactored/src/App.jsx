import { useEffect, useRef } from 'react';
import LoginForm from './components/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { initializeBlogs } from './reducers/blogReducer';
import { logoutUser } from './reducers/userReducer';
import { Route, Routes, useNavigate } from 'react-router-dom';
import UserList from './components/UserList';
import BlogList from './components/BlogList';
import User from './components/User';
import Blog from './components/Blog';
import Menu from './components/Menu';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => {
    const copyState = [...state.blogs];
    return copyState.sort((a, b) => b.likes - a.likes);
  });
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('entro');
    async function fetchBlogs() {
      await dispatch(initializeBlogs());
    }
    if (user) {
      fetchBlogs();
    } else {
      navigate('/login');
    }
  }, [dispatch, user, navigate]);

  return (
    <div>
      <Menu user={user} />
      <h1>Blogs app</h1>

      <Routes>
        <Route path="/users" element={<UserList blogs={blogs} />} />
        <Route
          path="/blogs"
          element={<BlogList blogs={blogs} notification={notification} />}
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </div>
  );
};

export default App;
