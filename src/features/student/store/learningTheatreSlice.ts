import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LearningTheatreState, Document } from '../types/learningTheatreTypes';

const initialState: LearningTheatreState = {
  status: 'empty',
  error: null,
  documents: {
    openDocuments: [],
    activeDocumentId: null,
    splitMode: false,
    secondaryDocumentId: null,
  },
};

const learningTheatreSlice = createSlice({
  name: 'learningTheatre',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<LearningTheatreState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.status = 'error';
      }
    },
    openDocument: (state, action: PayloadAction<Document>) => {
      const exists = state.documents.openDocuments.find(doc => doc.id === action.payload.id);
      if (!exists) {
        state.documents.openDocuments.push(action.payload);
      }
      state.documents.activeDocumentId = action.payload.id;
      state.status = 'playing';
    },
    closeDocument: (state, action: PayloadAction<string>) => {
      state.documents.openDocuments = state.documents.openDocuments.filter(
        doc => doc.id !== action.payload
      );

      if (state.documents.activeDocumentId === action.payload) {
        state.documents.activeDocumentId = state.documents.openDocuments.length > 0
          ? state.documents.openDocuments[state.documents.openDocuments.length - 1].id
          : null;
      }

      if (state.documents.secondaryDocumentId === action.payload) {
        state.documents.secondaryDocumentId = null;
        state.documents.splitMode = false;
      }

      if (state.documents.openDocuments.length === 0) {
        state.status = 'empty';
      }
    },
    setActiveDocument: (state, action: PayloadAction<string>) => {
      state.documents.activeDocumentId = action.payload;
    },
    toggleSplitMode: (state) => {
      state.documents.splitMode = !state.documents.splitMode;
      if (state.documents.splitMode && !state.documents.secondaryDocumentId) {
        // Default to the first document or active if available
        state.documents.secondaryDocumentId = state.documents.activeDocumentId;
      }
    },
    setSecondaryDocument: (state, action: PayloadAction<string | null>) => {
      state.documents.secondaryDocumentId = action.payload;
    },
    resetTheatre: () => {
      return initialState;
    },
  },
});

export const {
  setStatus,
  setError,
  openDocument,
  closeDocument,
  setActiveDocument,
  toggleSplitMode,
  setSecondaryDocument,
  resetTheatre,
} = learningTheatreSlice.actions;

export default learningTheatreSlice.reducer;
