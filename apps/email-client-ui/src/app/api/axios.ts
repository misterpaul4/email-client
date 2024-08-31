import { GLOBAL_PREFIX } from '@constants';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER + `/${GLOBAL_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

const bridgeClient = axios.create({
  baseURL: import.meta.env.VITE_BRIDGE_SERVER + `/${GLOBAL_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export { apiClient, bridgeClient }
