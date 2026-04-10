import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import learningTheatreReducer from '../store/learningTheatreSlice';
import LearningTheatre from '../pages/LearningTheatre';
import { useParams } from 'react-router-dom';

// Note: We need to mock some hooks to test different states
import * as useCourseActions from '@/features/courses/hooks/useCourseActions';
import { vi } from 'vitest';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(),
        useNavigate: vi.fn(),
    };
});

vi.mock('@/features/courses/hooks/useCourseActions', () => ({
    useGetCourseById: vi.fn(),
}));

vi.mock('@/hooks/useSections', () => ({
    useGetSections: vi.fn(() => ({ data: { documents: [] }, isLoading: false })),
}));

vi.mock('@/hooks/useLessons', () => ({
    useGetLessonsByCourse: vi.fn(() => ({ data: { documents: [] }, isLoading: false })),
}));

vi.mock('@/features/auth', () => ({
    useCurrentAccount: vi.fn(() => ({ data: { $id: 'user1' }, isLoading: false })),
}));

vi.mock('../hooks/useStudent', () => ({
    useGetStudentProgress: vi.fn(() => ({ data: {}, isLoading: false })),
    useMarkLessonComplete: vi.fn(() => ({ mutate: vi.fn() })),
    useUpdateLastAccessed: vi.fn(() => ({ mutate: vi.fn() })),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      learningTheatre: learningTheatreReducer
    },
    preloadedState: {
      learningTheatre: {
        status: 'playing',
        error: null,
        documents: {
          openDocuments: [],
          activeDocumentId: null,
          splitMode: false,
          secondaryDocumentId: null,
        },
        ...initialState
      }
    }
  });
};

describe('LearningTheatre System States', () => {
  it('renders loading spinner when data is loading', () => {
    (useCourseActions.useGetCourseById as any).mockReturnValue({ isLoading: true });
    (useParams as any).mockReturnValue({ id: 'course1' });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <LearningTheatre />
      </Provider>
    );

    expect(screen.getByRole('progressbar', { hidden: true }) || screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error message when course is not found', () => {
    (useCourseActions.useGetCourseById as any).mockReturnValue({ data: null, isLoading: false });
    (useParams as any).mockReturnValue({ id: 'course1' });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <LearningTheatre />
      </Provider>
    );

    expect(screen.getByText(/Course Not Found/i)).toBeInTheDocument();
  });
});
