import axios from 'axios';

const baseInstance = axios.create({
  timeout: 5000,
});

export const localspallingAPI = baseInstance.create({
  baseURL: import.meta.env.VITE_LOCAL_SPALLING_API_BASE_URL, 
});

export const localflatnessAPI = baseInstance.create({
  baseURL: import.meta.env.VITE_LOCAL_FLAT_API_BASE_URL, 
});

export const spallingAPI = baseInstance.create({
  baseURL: import.meta.env.VITE_SPALLING_API_BASE_URL, 
});

export const flatnessAPI = baseInstance.create({
  baseURL: import.meta.env.VITE_FLAT_API_BASE_URL, 
});

export const OSS = baseInstance.create({
  baseURL: import.meta.env.VITE_OSS_BASE_URL,
})