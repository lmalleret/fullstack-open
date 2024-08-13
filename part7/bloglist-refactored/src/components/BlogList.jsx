import { useRef } from 'react';
import Blog from './Blog';
import NewBlogForm from './NewBlogForm';
import Notification from './Notification';
import Togglable from './Toggable';
import { Link } from 'react-router-dom';

function BlogList({ blogs, notification }) {
  const blogFormRef = useRef();
  return (
    <>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <Togglable
        buttonShowLabel="new blog"
        buttonHideLabel="cancel"
        ref={blogFormRef}
      >
        <NewBlogForm />
      </Togglable>

      {blogs.map((blog) => (
        <p key={blog.id}>
          <Link to={`blogs/${blog.id}`}>{blog.title}</Link>
        </p>
      ))}
    </>
  );
}

export default BlogList;
