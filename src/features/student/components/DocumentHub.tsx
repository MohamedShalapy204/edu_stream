import { type FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { ILesson } from '@/features/courses';
import { storageService } from '@/services/appwrite/storage/storageService';
import {
  HiOutlineInformationCircle,
  HiOutlinePaperClip,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineDocumentDuplicate
} from 'react-icons/hi2';
import { openDocument } from '../store/learningTheatreSlice';

interface DocumentHubProps {
  lesson: ILesson;
}

export const DocumentHub: FC<DocumentHubProps> = ({ lesson }) => {
  const dispatch = useAppDispatch();
  const { openDocuments } = useAppSelector((state) => state.learningTheatre.documents);

  const exhibits = lesson.document_ids || [];

  return (
    <div className="h-full w-full bg-white/40 backdrop-blur-3xl border-l border-white/50 flex flex-col shadow-inner overflow-hidden">
      {/* Hub Header */}
      <div className="p-6 border-b border-base-content/5 flex-none bg-white/20 backdrop-blur-md z-20">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Resource Catalog</h3>
      </div>

      {/* Resource Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
        {/* Curator's Notes */}
        <section>
          <div className="flex items-center gap-3 mb-6 text-primary/40">
            <HiOutlineInformationCircle className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Curator's Notes</span>
          </div>
          <div className="prose prose-sm max-w-none">
            {lesson.description ? (
              <p className="text-sm font-medium text-base-content/70 leading-relaxed italic border-l-2 border-primary/20 pl-6">
                {lesson.description}
              </p>
            ) : (
              <p className="text-base-content/30 italic text-xs">No specific instructions provided for this module.</p>
            )}
          </div>
        </section>

        {/* Resource Library */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary/40">
            <HiOutlinePaperClip className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exhibits</span>
          </div>

          <div className="space-y-3">
            {exhibits.map((docId, index) => {
              const url = storageService.getFileView(docId).toString();
              const isOpened = openDocuments.some(d => d.id === docId);

              return (
                <div
                  key={docId}
                  className={`group p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${isOpened
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-white/40 border-white/40 hover:bg-primary/5 hover:border-primary/20'
                    }`}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => dispatch(openDocument({
                      id: docId,
                      title: `Exhibit ${index + 1}`,
                      url: url
                    }))}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-0.5">Exhibit {index + 1}</p>
                    <p className={`text-xs font-bold transition-colors ${isOpened ? 'text-primary' : 'text-base-content group-hover:text-primary'}`}>
                      {isOpened ? 'Active in Workspace' : 'Mount to Workspace'}
                    </p>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-base-content/20 hover:text-primary transition-colors"
                    title="Open in new window"
                  >
                    <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>

          {exhibits.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-base-content/10">
              <HiOutlineDocumentDuplicate className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-[10px] font-black uppercase tracking-widest">No Exhibits Provided</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
