import fetchWithAuth from "./api";

export const authService = {
  // Register a new user
  register: async (name, email, password) => {
    return await fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Login user
  login: async (email, password) => {
    return await fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return await fetchWithAuth("/auth/me");
  },

  // Logout user
  logout: async () => {
    return await fetchWithAuth("/auth/logout", {
      method: "POST",
    });
  },
};

export const whiteboardService = {
  // Get all boards for current user
  getAllBoards: async (userId) => {
    return await fetchWithAuth(`/boards?userId=${userId}`);
  },

  // Get a single board by ID
  getBoard: async (id, userId) => {
    return await fetchWithAuth(`/boards/${id}?userId=${userId}`);
  },

  // Create a new whiteboard
  createWhiteboard: async (title, userId) => {
    return await fetchWithAuth("/boards", {
      method: "POST",
      body: JSON.stringify({ title, userId }),
    });
  },

  // Update a board
  updateBoard: async (id, userId, data) => {
    return await fetchWithAuth(`/boards/${id}?userId=${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Delete a board
  deleteBoard: async (id, userId) => {
    return await fetchWithAuth(`/boards/${id}?userId=${userId}`, {
      method: "DELETE",
    });
  },

  // Invite collaborator
  inviteCollaborator: async (whiteboardId, email, role) => {
    return await fetchWithAuth(`/whiteboards/${whiteboardId}/invite`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });
  },

  // Remove collaborator
  removeCollaborator: async (whiteboardId, userId) => {
    return await fetchWithAuth(
      `/whiteboards/${whiteboardId}/collaborators/${userId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Generate share link
  generateShareLink: async (whiteboardId, role, expiresIn) => {
    return await fetchWithAuth(`/whiteboards/${whiteboardId}/share-link`, {
      method: "POST",
      body: JSON.stringify({ role, expiresIn }),
    });
  },
};

export default fetchWithAuth;
