// src/services/api.ts
import axios from 'axios';

// Cambia esta baseURL por la de tu endpoint de MockAPI cuando la tengas lista
export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});