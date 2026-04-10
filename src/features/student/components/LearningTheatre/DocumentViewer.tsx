import React from 'react';

interface DocumentViewerProps {
  url: string;
  className?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ url, className = '' }) => {
  return (
    <div className={`w-full h-full bg-base-300 relative overflow-hidden flex flex-col ${className}`}>
      <object
        data={url}
        type="application/pdf"
        className="w-full h-full grow"
        title="PDF Document"
      >
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
          <p className="mb-4 text-lg font-medium">It seems your browser cannot display this PDF inline.</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Download PDF to View
          </a>
        </div>
      </object>
    </div>
  );
};

export default DocumentViewer;
