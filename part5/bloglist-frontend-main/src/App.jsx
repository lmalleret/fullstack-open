import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Toggable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ type: null, message: "" });
  const blogFormRef = useRef();

  useEffect(() => {
    async function fetchBlogs() {
      blogService.setToken(user.token);
      const blogs = await blogService.getAll();
      blogs.sort((a,b)=>  b.likes - a.likes)
      setBlogs(blogs);
    }
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
  };

  const handleSetNotification = (notification) => {
    setNotification(notification);
    setTimeout(() => setNotification({ type: null, message: "" }), 5000);
  };

  return (
    <div>
      {!user ? (
        <>
          <LoginForm
            setUser={setUser}
            handleSetNotification={handleSetNotification}
          />
          <Notification notification={notification} />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <span>{user.name} logged in</span>
          <button onClick={handleLogout}>logout</button>
          <Notification notification={notification} />
          <Togglable buttonShowLabel="new blog" buttonHideLabel="cancel" ref={blogFormRef}>
            <NewBlogForm
              blogs={blogs}
              setBlogs={setBlogs}
              handleSetNotification={handleSetNotification}
            />
          </Togglable>
          
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
