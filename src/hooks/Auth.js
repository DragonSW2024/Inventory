import axios from 'axios';

const API_BASE = 'http://192.168.10.102:8866/api/auth';

export const signup = async (data) => {
  return axios.post(`${API_BASE}/signup`, data);
};

export const login = async (data) => {
  return axios.post(`${API_BASE}/login`, data);
};
