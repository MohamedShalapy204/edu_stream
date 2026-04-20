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
import { useTranslation } from 'react-i18next';
import { openDocument } from '../store/learningTheatreSlice';

interface DocumentHubProps {
  lesson: ILesson;
}

export const DocumentHub: FC<DocumentHubProps> = ({ lesson }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { openDocuments } = useAppSelector((state) => state.learningTheatre.documents);

  const exhibits = lesson.document_ids || [];

  return (
    <div className="h-full w-full bg-base-100 border-l border-base-content/5 flex flex-col overflow-hidden">
      {/* Hub Header */}
      <div className="p-6 border-b border-base-content/5 flex-none bg-base-200/50 z-20">
        <h3 className="label-caps !text-primary/60">{t('theatre.resourceCatalogue')}</h3>
      </div>

      {/* Resource Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
        {/* Curator's Notes */}
        <section>
          <div className="flex items-center gap-3 mb-6 text-primary/40">
            <HiOutlineInformationCircle className="w-5 h-5" />
            <span className="label-caps">{t('theatre.curatorNotes')}</span>
          </div>
          <div className="prose prose-sm max-w-none">
            {lesson.description ? (
              <p className="body-prose text-sm !italic border-l-2 border-primary/30 pl-6 py-1 opacity-70">
                {lesson.description}
              </p>
            ) : (
              <p className="body-prose text-xs opacity-30 italic">{t('theatre.noInstructions')}</p>
            )}
          </div>
        </section>

        {/* Resource Library */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary/40">
            <HiOutlinePaperClip className="w-5 h-5" />
            <span className="label-caps">{t('theatre.archivalExhibits')}</span>
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
                    : 'bg-base-200 border-base-content/5 hover:bg-primary/5 hover:border-primary/20'
                    }`}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => dispatch(openDocument({
                      id: docId,
                      title: `${t('theatre.exhibit')} ${index + 1}`,
                      url: url,
                      type: 'doc'
                    }))}
                  >
                    <p className="label-caps !text-[9px] !text-primary/40 mb-0.5">{t('theatre.exhibit')} {index + 1}</p>
                    <p className={`text-xs font-semibold transition-colors ${isOpened ? 'text-primary' : 'text-base-content group-hover:text-primary'}`}>
                      {isOpened ? t('theatre.activeInWorkspace') : t('theatre.examineInWorkspace')}
                    </p>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-base-content/20 hover:text-primary transition-colors"
                    title={t('theatre.openInNewWindow')}
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
              <p className="label-caps">{t('theatre.archiveEmpty')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
