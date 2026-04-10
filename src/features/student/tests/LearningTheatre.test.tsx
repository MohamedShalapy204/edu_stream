import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LearningTheatre from '../pages/LearningTheatre';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import learningTheatreReducer from '../store/learningTheatreSlice';

// Mock child components to focus on layout tests
vi.mock('../components/LearningTheatre/DocumentController', () => ({
  default: () => <div data-testid="document-controller">Document Controller</div>
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

describe('LearningTheatre Layout', () => {
  it('renders the central video player container', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LearningTheatre />
      </Provider>
    );

    const videoPlayer = screen.getByTestId('video-player-container');
    expect(videoPlayer).toBeInTheDocument();
  });

  it('renders the DocumentController alongside video player', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LearningTheatre />
      </Provider>
    );

    expect(screen.getByTestId('document-controller')).toBeInTheDocument();
  });

  it('has responsive grid/flex classes for layout', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <LearningTheatre />
      </Provider>
    );

    // Check for common responsive layout classes like 'flex-col', 'lg:flex-row' or grid equivalents
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex');
    // More specific class checks will depend on the final implementation
  });
});
