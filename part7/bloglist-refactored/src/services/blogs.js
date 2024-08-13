import api from './api';
const baseUrl = '/blogs';

const getAll = async () => {
  const response = await api.get(baseUrl);
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`${baseUrl}/${id}`);
  return response.data;
};

const create = async (newObject) => {
  const response = await api.post(baseUrl, newObject);
  return response.data;
};

const update = async (id, newObject) => {
  const response = await api.put(`${baseUrl}/${id}`, newObject);
  return response.data;
};

const deleteBlog = async (id) => {
  const response = await api.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default { getAll, create, update, deleteBlog, getById };
