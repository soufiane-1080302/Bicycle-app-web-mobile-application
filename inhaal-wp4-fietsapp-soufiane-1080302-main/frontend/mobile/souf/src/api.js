import axios from 'axios';

const API_BASE_URL = 'http://192.168.178.29:5000/api/weather'; // Gebruik hier je backend-URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getWeatherById = (id) => {
  if (!id) throw new Error('ID is verplicht om weergegevens op te halen.');
  return api.get(`/${id}`);
};

export const getAllWeather = () => api.get('/');

export const saveWeather = (data) => api.post('/', data);

export const updateWeather = (id, data) => api.put(`/${id}`, data);

export const deleteWeather = (id) => api.delete(`/${id}`);

export default api;