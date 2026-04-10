import React from 'react';
import type { Document } from '../../types/learningTheatreTypes';
import { X } from 'lucide-react';

interface DocumentTabsProps {
  documents: Document[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

const DocumentTabs: React.FC<DocumentTabsProps> = ({
  documents,
  activeId,
  onSelect,
  onClose,
}) => {
  if (documents.length === 0) return null;

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div 
      role="tablist" 
      aria-label="Opened documents"
      className="tabs tabs-lifted overflow-x-auto flex-nowrap border-b border-base-300 bg-base-200/50 pt-2 px-2"
    >
      {documents.map((doc) => (
        <div
          key={doc.id}
          role="tab"
          aria-selected={activeId === doc.id}
          aria-controls={`panel-${doc.id}`}
          tabIndex={activeId === doc.id ? 0 : -1}
          className={`tab flex items-center gap-2 group transition-all duration-200 ${
            activeId === doc.id ? 'tab-active [--tab-bg:var(--color-base-100)]' : 'hover:bg-base-300/50'
          }`}
          onClick={() => onSelect(doc.id)}
          onKeyDown={(e) => handleKeyDown(e, doc.id)}
        >
          <span className="max-w-[150px] truncate text-sm font-medium">
            {doc.title}
          </span>
          <button
            aria-label={`Close ${doc.title}`}
            className="p-0.5 rounded-full hover:bg-base-content/10 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:bg-base-content/10"
            onClick={(e) => {
              e.stopPropagation();
              onClose(doc.id);
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentTabs;
