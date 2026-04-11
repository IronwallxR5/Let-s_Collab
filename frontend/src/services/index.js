import fetchWithAuth from "./api";

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
};

export { default as inviteService } from "./inviteService";

export default fetchWithAuth;
