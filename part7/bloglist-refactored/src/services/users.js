import api from './api';

const baseUrl = '/users';

const getAllUsers = async () => {
  const response = await api.get(baseUrl);
  return response.data;
};

const getUserById = async (id) => {
  const response = await api.get(`${baseUrl}/${id}`);
  return response.data;
};

export default { getAllUsers, getUserById };
