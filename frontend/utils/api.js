import { API_BASE_URL, ENDPOINTS, STORAGE_KEYS } from './config';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic fetch handler with error management
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // 404 for data endpoints often means "no data found" - treat as empty, not error
    if (response.status === 404) {
      return { content: [], data: [], message: data.message || 'No data found' };
    }

    const error = new Error(data.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// API Methods
export const api = {
  // Register
  register: async (name, uniqueId, email, password) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers:{
              'Content-Type': 'application/json'
             },
      body: JSON.stringify({ name, uniqueId, email, password }),
    });
    return handleResponse(response);
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
      method: 'POST',
      // headers: getAuthHeaders(),
      headers:{
                'Content-Type': 'application/json'
            },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Chat (verify auth)
  verifyAuth: async () => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Fetch rooms
  fetchRooms: async (userId) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ROOMS}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: userId }),
    });
    return handleResponse(response);
  },

  // Fetch messages
  fetchMessages: async (roomId) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.MESSAGE}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ roomId }),
    });
    return handleResponse(response);
  },

  // Fetch friend requests
  fetchRequests: async (userId) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REQUEST}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: userId }),
    });
    return handleResponse(response);
  },
};

export default api;
