import { create } from 'zustand';

export const useWhiteboardStore = create((set) => ({
  whiteboards: [],
  currentWhiteboard: null,
  collaborators: [],
  loading: false,
  error: null,

  setWhiteboards: (whiteboards) => set({ whiteboards }),
  
  setCurrentWhiteboard: (whiteboard) => set({ currentWhiteboard: whiteboard }),
  
  addWhiteboard: (whiteboard) =>
    set((state) => ({
      whiteboards: [whiteboard, ...state.whiteboards],
    })),

  updateWhiteboard: (id, updates) =>
    set((state) => ({
      whiteboards: state.whiteboards.map((wb) =>
        wb.id === id ? { ...wb, ...updates } : wb
      ),
      currentWhiteboard:
        state.currentWhiteboard?.id === id
          ? { ...state.currentWhiteboard, ...updates }
          : state.currentWhiteboard,
    })),

  deleteWhiteboard: (id) =>
    set((state) => ({
      whiteboards: state.whiteboards.filter((wb) => wb.id !== id),
      currentWhiteboard:
        state.currentWhiteboard?.id === id ? null : state.currentWhiteboard,
    })),

  setCollaborators: (collaborators) => set({ collaborators }),

  addCollaborator: (collaborator) =>
    set((state) => ({
      collaborators: [...state.collaborators, collaborator],
    })),

  removeCollaborator: (userId) =>
    set((state) => ({
      collaborators: state.collaborators.filter((c) => c.id !== userId),
    })),

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));
