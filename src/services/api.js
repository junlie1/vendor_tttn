import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL_BACKEND,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    // console.log('API Request:', {
    //   method: config.method,
    //   url: config.url,
    //   data: config.data
    // });
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    // console.log('API Response:', {
    //   status: response.status,
    //   data: response.data
    // });
    return response;
  },
  error => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export default api; 