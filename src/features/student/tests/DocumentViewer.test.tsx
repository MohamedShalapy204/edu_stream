import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DocumentViewer from '../components/LearningTheatre/DocumentViewer';

describe('DocumentViewer', () => {
  it('renders a PDF using an object tag', () => {
    const url = 'https://example.com/test.pdf';
    render(<DocumentViewer url={url} />);

    const objectElement = screen.getByTitle('PDF Document');
    expect(objectElement).toBeInTheDocument();
    expect(objectElement).toHaveAttribute('data', url);
    expect(objectElement).toHaveAttribute('type', 'application/pdf');
  });

  it('renders a fallback link when PDF cannot be displayed inline', () => {
    const url = 'https://example.com/test.pdf';
    render(<DocumentViewer url={url} />);

    const fallbackLink = screen.getByText(/Download PDF/i);
    expect(fallbackLink).toBeInTheDocument();
    expect(fallbackLink).toHaveAttribute('href', url);
  });
});
