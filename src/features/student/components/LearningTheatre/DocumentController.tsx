import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setActiveDocument,
  closeDocument,
  setSecondaryDocument,
  toggleSplitMode
} from '../../store/learningTheatreSlice';
import DocumentTabs from './DocumentTabs';
import DocumentViewer from './DocumentViewer';
import { Columns, Layout, ChevronDown, Repeat } from 'lucide-react';

const DocumentController: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    openDocuments,
    activeDocumentId,
    splitMode,
    secondaryDocumentId
  } = useAppSelector((state) => state.learningTheatre.documents);

  const activeDoc = openDocuments.find(d => d.id === activeDocumentId);
  const secondaryDoc = openDocuments.find(d => d.id === secondaryDocumentId);

  if (openDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-base-200 text-base-content/50 p-8 border-2 border-dashed border-base-300 rounded-xl">
        <Layout size={48} className="mb-4 opacity-20" />
        <p>No documents open. Select a document from the lesson contents to begin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-xl overflow-hidden shadow-card border border-base-300">
      {/* Primary Header - Dual Layout if Split */}
      <div className={`flex items-center bg-base-200/50 border-b border-base-300 ${splitMode ? 'divide-x divide-base-300' : ''}`}>
        {/* Left Side Header (Primary) */}
        <div className={`flex items-center justify-between pr-2 ${splitMode ? 'w-1/2' : 'grow'}`}>
          <DocumentTabs
            documents={openDocuments}
            activeId={activeDocumentId}
            onSelect={(id) => dispatch(setActiveDocument(id))}
            onClose={(id) => dispatch(closeDocument(id))}
          />
          {!splitMode && (
            <div className="flex items-center gap-1 border-l border-base-300 pl-2">
              <button
                className="btn btn-ghost btn-sm btn-square"
                onClick={() => dispatch(toggleSplitMode())}
                title="Enable Split View"
              >
                <Columns size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Right Side Header (Secondary) */}
        {splitMode && (
          <div className="w-1/2 flex items-center justify-between px-3 h-12 bg-base-200/80">
            <div className="dropdown dropdown-bottom">
              <div tabIndex={0} role="button" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-focus transition-colors">
                <span className="truncate max-w-[120px]">{secondaryDoc?.title || "Select Document"}</span>
                <ChevronDown size={14} />
              </div>
              <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-2xl bg-base-100 rounded-box w-52 mt-2 border border-base-300">
                <li className="menu-title text-[10px] opacity-40">Switch Secondary View</li>
                {openDocuments.map(doc => (
                  <li key={doc.id}>
                    <button
                      className={secondaryDocumentId === doc.id ? 'active' : ''}
                      onClick={() => {
                        dispatch(setSecondaryDocument(doc.id));
                        (document.activeElement as HTMLElement)?.blur();
                      }}
                    >
                      {doc.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="btn btn-ghost btn-xs btn-square opacity-50 hover:opacity-100"
                onClick={() => {
                  const currentPrimary = activeDocumentId;
                  const currentSecondary = secondaryDocumentId;
                  if (currentPrimary) dispatch(setSecondaryDocument(currentPrimary));
                  if (currentSecondary) dispatch(setActiveDocument(currentSecondary));
                }}
                title="Swap Panes"
              >
                <Repeat size={14} />
              </button>
              <button
                className="btn btn-ghost btn-xs btn-square text-error/60 hover:text-error hover:bg-error/10"
                onClick={() => dispatch(toggleSplitMode())}
                title="Close Split View"
              >
                <Layout size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className={`grow flex ${splitMode ? 'flex-row' : 'flex-col'} overflow-hidden`}>
        <div
          role="tabpanel"
          id={activeDoc ? `panel-${activeDoc.id}` : 'panel-empty'}
          className={`relative h-full ${splitMode ? 'w-1/2 border-r border-base-300' : 'w-full'}`}
        >
          {activeDoc ? (
            <DocumentViewer url={activeDoc.url} />
          ) : (
            <div className="flex items-center justify-center h-full text-base-content/30 italic">Select a document from the tabs</div>
          )}
        </div>

        {splitMode && (
          <div
            role="tabpanel"
            aria-label="Secondary document view"
            className="relative h-full w-1/2 bg-base-100"
          >
            {secondaryDoc ? (
              <DocumentViewer url={secondaryDoc.url} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-base-200/30">
                <Layout size={32} className="mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">Secondary Workspace</p>
                <p className="text-sm opacity-50 mb-6">Select a document from the header dropdown to view it side-by-side.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentController;
