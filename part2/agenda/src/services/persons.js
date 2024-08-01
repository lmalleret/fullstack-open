import axios from "axios";

const baseURL = "/api/persons";

const getAll = () => {
  const request = axios.get(baseURL);
  return request.then((response) => response.data);
};

const addPerson = (json) => {
  const request = axios.post(baseURL, json);
  return request.then((response) => response.data);
};

const updatePerson = (id, json) => {
  const request = axios.put(`${baseURL}/${id}`, json);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseURL}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, addPerson, updatePerson, deletePerson };
