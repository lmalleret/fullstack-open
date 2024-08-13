import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setState(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      return [...state, action.payload];
    },
    updateBlog(state, action) {
      console.log(action.payload.id);

      return state.map((item) =>
        item.id !== action.payload.id ? item : action.payload
      );
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((item) => item.id !== id);
    },
  },
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setState(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newAnecdote = await blogService.create(blog);
    dispatch(addBlog(newAnecdote));
  };
};

export const updateLikeBlog = (id, blog) => {
  return async (dispatch) => {
    const blogUpdated = await blogService.update(id, blog);
    dispatch(updateBlog(blogUpdated));
  };
};

export const createComment = (id, content) => {
  return async (dispatch) => {
    const commentCreated = await blogService.postComment(id, content);
    dispatch(updateBlog(commentCreated));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);
    dispatch(removeBlog(id));
  };
};

export const { setState, addBlog, updateBlog, removeBlog } = blogSlice.actions;
export default blogSlice.reducer;
