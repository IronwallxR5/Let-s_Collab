import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWhiteboardStore = create(
  persist(
    (set, get) => ({
      whiteboards: [],
      
      // Load whiteboards from localStorage
      loadWhiteboards: () => {
        const savedBoards = JSON.parse(localStorage.getItem('whiteboards') || '[]');
        set({ whiteboards: savedBoards });
      },
      
      // Add a new whiteboard
      addWhiteboard: (whiteboard) => {
        const updatedBoards = [...get().whiteboards, whiteboard];
        localStorage.setItem('whiteboards', JSON.stringify(updatedBoards));
        set({ whiteboards: updatedBoards });
        return whiteboard;
      },
      
      // Update an existing whiteboard
      updateWhiteboard: (id, updates) => {
        const updatedBoards = get().whiteboards.map((board) =>
          board.id === id ? { ...board, ...updates, updatedAt: new Date().toISOString() } : board
        );
        localStorage.setItem('whiteboards', JSON.stringify(updatedBoards));
        set({ whiteboards: updatedBoards });
      },
      
      // Delete a whiteboard
      deleteWhiteboard: (id) => {
        const updatedBoards = get().whiteboards.filter((board) => board.id !== id);
        localStorage.setItem('whiteboards', JSON.stringify(updatedBoards));
        set({ whiteboards: updatedBoards });
      },
      
      // Get a single whiteboard by ID
      getWhiteboard: (id) => {
        return get().whiteboards.find((board) => board.id === id);
      },
    }),
    {
      name: 'whiteboard-storage',
    }
  )
);

export default useWhiteboardStore;
