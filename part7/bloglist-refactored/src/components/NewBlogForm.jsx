import React from 'react';
import { useField } from '../hooks/useFields';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

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
            message: 'Success: Entrie created',
          },
          5
        )
      );
    } catch (err) {
      dispatch(
        setNotification(
          {
            type: 'error',
            message: 'Error: Entrie could not be created',
          },
          5
        )
      );
    }
  };

  return (
    <>
      <h2>create new entrie</h2>
      <form onSubmit={submitNewBlog}>
        <div>
          <span>title: </span>
          <input {...title} />
        </div>
        <div>
          <span>author: </span>
          <input {...author} />
        </div>
        <div>
          <span>url: </span>
          <input {...url} />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
}

export default NewBlogForm;
