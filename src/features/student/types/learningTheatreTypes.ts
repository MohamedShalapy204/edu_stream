export type LearningTheatreStatus = 'loading' | 'error' | 'empty' | 'playing';

export interface Document {
  id: string;
  title: string;
  url: string;
}

export interface DocumentControllerState {
  openDocuments: Document[];
  activeDocumentId: string | null;
  splitMode: boolean;
  secondaryDocumentId: string | null;
}

export interface LearningTheatreState {
  status: LearningTheatreStatus;
  error: string | null;
  documents: DocumentControllerState;
}
