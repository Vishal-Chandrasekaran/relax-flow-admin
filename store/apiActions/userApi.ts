import axios from '../../utils/axiosConfig';
import { generateUniqueId } from '../../utils/CommonService';

// GET request example
export const getUserList = (params?: any) => {
  const dummy = params;
  debugger;
  return axios.get('/api/v1/users', { params: { ...params } });
}

// POST request example
export const createUser = (body: any) => 
  axios.post('/api/v1/users', body);

// PUT request example
export const updateUser = (id: number, body: any) => 
  axios.put(`/api/v1/users/${id}`, body);

// DELETE request example
export const deleteUser = (id: number) => 
  axios.delete(`/api/v1/users/${id}`); 