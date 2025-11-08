import api from './api';

export const authService = {
  // Register a new user
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export const whiteboardService = {
  // Get all whiteboards for current user
  getAllWhiteboards: async () => {
    const response = await api.get('/whiteboards');
    return response.data;
  },

  // Get a single whiteboard by ID
  getWhiteboard: async (id) => {
    const response = await api.get(`/whiteboards/${id}`);
    return response.data;
  },

  // Create a new whiteboard
  createWhiteboard: async (title) => {
    const response = await api.post('/whiteboards', { title });
    return response.data;
  },

  // Update a whiteboard
  updateWhiteboard: async (id, data) => {
    const response = await api.put(`/whiteboards/${id}`, data);
    return response.data;
  },

  // Delete a whiteboard
  deleteWhiteboard: async (id) => {
    const response = await api.delete(`/whiteboards/${id}`);
    return response.data;
  },

  // Invite collaborator
  inviteCollaborator: async (whiteboardId, email, role) => {
    const response = await api.post(`/whiteboards/${whiteboardId}/invite`, { email, role });
    return response.data;
  },

  // Remove collaborator
  removeCollaborator: async (whiteboardId, userId) => {
    const response = await api.delete(`/whiteboards/${whiteboardId}/collaborators/${userId}`);
    return response.data;
  },

  // Generate share link
  generateShareLink: async (whiteboardId, role, expiresIn) => {
    const response = await api.post(`/whiteboards/${whiteboardId}/share-link`, {
      role,
      expiresIn,
    });
    return response.data;
  },
};

export default api;
