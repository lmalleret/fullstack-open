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
    likeBlog(state, action) {
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
    const updateBlog = await blogService.update(id, blog);
    dispatch(likeBlog(updateBlog));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);
    dispatch(removeBlog(id));
  };
};

export const { setState, addBlog, likeBlog, removeBlog } = blogSlice.actions;
export default blogSlice.reducer;
