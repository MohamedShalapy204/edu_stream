import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { openDocument } from '../store/learningTheatreSlice';
import LearningTheatre from '../pages/LearningTheatre';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import learningTheatreReducer from '../store/learningTheatreSlice';

// Mock child components to focus on layout tests
vi.mock('../components/LearningTheatre/DocumentController', () => ({
  default: () => <div data-testid="document-controller">Document Controller</div>
}));

vi.mock('@/features/courses/hooks/useCourseActions', () => ({
  useGetCourseById: vi.fn(() => ({ data: { title: 'Test Course' }, isLoading: false })),
}));

vi.mock('@/hooks/useSections', () => ({
  useGetSections: vi.fn(() => ({ data: { documents: [] }, isLoading: false })),
}));

vi.mock('@/hooks/useLessons', () => ({
  useGetLessonsByCourse: vi.fn(() => ({ data: { documents: [{ $id: 'lesson1', title: 'Test Lesson', order: 1 }] }, isLoading: false })),
}));

vi.mock('@/features/auth', () => ({
  useCurrentAccount: vi.fn(() => ({ data: { $id: 'user1' }, isLoading: false })),
}));

vi.mock('../hooks/useStudent', () => ({
  useGetStudentProgress: vi.fn(() => ({ data: {}, isLoading: false })),
  useMarkLessonComplete: vi.fn(() => ({ mutate: vi.fn() })),
  useUpdateLastAccessed: vi.fn(() => ({ mutate: vi.fn() })),
}));

import { type LearningTheatreState } from '../types/learningTheatreTypes';

const createMockStore = (initialState: Partial<LearningTheatreState> = {}) => {
  const preloadedState: LearningTheatreState = {
    status: 'playing',
    error: null,
    documents: {
      openDocuments: [],
      activeDocumentId: null,
      splitMode: false,
      secondaryDocumentId: null,
    },
    ...initialState
  };

  return configureStore({
    reducer: {
      learningTheatre: learningTheatreReducer
    },
    preloadedState: {
      learningTheatre: preloadedState
    }
  });
};

describe('LearningTheatre Layout', () => {
  it('renders the central video player container', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LearningTheatre />
        </MemoryRouter>
      </Provider>
    );

    const videoPlayer = screen.getByTestId('video-player-container');
    expect(videoPlayer).toBeInTheDocument();
  });

  it('renders the DocumentController alongside video player', () => {
    const store = createMockStore({
      documents: {
        openDocuments: [{ id: 'doc1', title: 'Test Doc', url: 'test' }],
        activeDocumentId: 'doc1',
        splitMode: false,
        secondaryDocumentId: null,
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LearningTheatre />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      store.dispatch(openDocument({ id: 'doc1', title: 'Test Doc', url: 'test' }));
    });

    expect(screen.getByTestId('document-controller')).toBeInTheDocument();
  });

  it('has responsive grid/flex classes for layout', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <LearningTheatre />
        </MemoryRouter>
      </Provider>
    );

    // Check for common responsive layout classes like 'flex-col', 'lg:flex-row' or grid equivalents
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex');
    // More specific class checks will depend on the final implementation
  });
});
