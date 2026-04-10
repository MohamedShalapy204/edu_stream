import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentTabs from '../components/LearningTheatre/DocumentTabs';
import { type Document } from '../types/learningTheatreTypes';

describe('DocumentTabs', () => {
  const mockDocuments: Document[] = [
    { id: '1', title: 'Doc 1', url: 'url1' },
    { id: '2', title: 'Doc 2', url: 'url2' },
  ];

  it('renders all open documents as tabs', () => {
    render(
      <DocumentTabs
        documents={mockDocuments}
        activeId="1"
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Doc 1')).toBeInTheDocument();
    expect(screen.getByText('Doc 2')).toBeInTheDocument();
  });

  it('marks the active tab correctly', () => {
    render(
      <DocumentTabs
        documents={mockDocuments}
        activeId="1"
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const activeTab = screen.getByText('Doc 1').closest('[role="tab"]');
    expect(activeTab).toHaveClass('tab-active');
  });

  it('calls onSelect when a tab is clicked', () => {
    const onSelect = vi.fn();
    render(
      <DocumentTabs
        documents={mockDocuments}
        activeId="1"
        onSelect={onSelect}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Doc 2'));
    expect(onSelect).toHaveBeenCalledWith('2');
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <DocumentTabs
        documents={mockDocuments}
        activeId="1"
        onSelect={vi.fn()}
        onClose={onClose}
      />
    );

    // Assuming there's a close button with an aria-label or specific text
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    fireEvent.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalledWith('1');
  });
});
