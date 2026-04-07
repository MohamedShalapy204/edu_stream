import { type FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { ILesson } from '@/features/courses';
import { storageService } from '@/services/appwrite/storage/storageService';
import { HiOutlineInformationCircle, HiOutlinePaperClip, HiOutlineArrowTopRightOnSquare, HiOutlineDocumentDuplicate, HiOutlineSquare2Stack, HiOutlineQueueList } from 'react-icons/hi2';
import { openTab, resetTheatre, setViewMode } from '../store/theatreSlice';
import DocumentTabs from './DocumentTabs';
import DocumentViewer from './DocumentViewer';

interface DocumentHubProps {
    lesson: ILesson;
}

export const DocumentHub: FC<DocumentHubProps> = ({ lesson }) => {
    const dispatch = useAppDispatch();

    // Reset tabs when lesson changes
    useEffect(() => {
        dispatch(resetTheatre());
    }, [lesson.$id, dispatch]);

    const { tabs, activeTabId, viewMode } = useAppSelector((state) => state.theatre);
    const activeTab = tabs.find(t => t.id === activeTabId);

    return (
        <div className="h-full w-full bg-white/40 backdrop-blur-3xl border-l border-white/50 flex flex-col shadow-inner overflow-hidden">
            {/* Hub Header Styled like Curriculum */}
            <div className="p-6 border-b border-base-content/5 flex-none bg-white/20 backdrop-blur-md z-20">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Workspace Hub</h3>

                    {/* View Mode Toggle */}
                    <div className="flex bg-black/5 p-1 rounded-xl border border-white/20 shadow-sm">
                        <button
                            onClick={() => dispatch(setViewMode('single'))}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'single' ? 'bg-white text-primary shadow-sm' : 'text-base-content/40 hover:text-base-content'}`}
                            title="Focus Mode"
                        >
                            <HiOutlineSquare2Stack className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => dispatch(setViewMode('stacked'))}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'stacked' ? 'bg-white text-primary shadow-sm' : 'text-base-content/40 hover:text-base-content'}`}
                            title="Research Stack"
                        >
                            <HiOutlineQueueList className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <DocumentTabs />
            </div>

            {/* Active Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-black/5">
                {tabs.length > 0 ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                        {viewMode === 'stacked' ? (
                            <div className="flex flex-col gap-4 p-4 min-h-full">
                                {tabs.map((tab) => (
                                    <div key={tab.id} className="flex-none h-[400px] rounded-2xl overflow-hidden border border-white/40 shadow-premium bg-white/50 flex flex-col">
                                        <div className="px-4 py-2 border-b border-white/20 bg-white/40 backdrop-blur-sm flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{tab.title}</span>
                                            <div className="flex items-center gap-2">
                                                {tab.url && (
                                                    <a href={tab.url} target="_blank" rel="noreferrer" className="p-1 text-base-content/40 hover:text-primary transition-colors">
                                                        <HiOutlineArrowTopRightOnSquare className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 relative">
                                            {tab.url ? (
                                                <DocumentViewer url={tab.url} />
                                            ) : (
                                                <div className="p-6 text-sm text-base-content/70 italic">
                                                    {tab.content}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Focus Mode (Single Active Tab) */
                            <div className="flex-1 relative h-full">
                                {activeTab?.url ? (
                                    <DocumentViewer url={activeTab.url} />
                                ) : (
                                    <div className="w-full h-full p-8 overflow-y-auto custom-scrollbar text-white/70">
                                        <h2 className="text-xl font-heading font-black mb-4 uppercase tracking-tighter italic text-primary">Module Context</h2>
                                        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                                            {activeTab?.content || "No manual content provided."}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
                        {/* Curator's Notes (Default View) */}
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
                        {lesson.document_ids && lesson.document_ids.length > 0 && (
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-primary/40">
                                    <HiOutlinePaperClip className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Resource Library</span>
                                </div>

                                <div className="space-y-3">
                                    {lesson.document_ids.map((docId, index) => (
                                        <div
                                            key={docId}
                                            className="group p-4 bg-white/40 hover:bg-primary/5 rounded-2xl border border-white/40 hover:border-primary/20 transition-all flex items-center justify-between shadow-sm"
                                        >
                                            <div
                                                className="flex-1 cursor-pointer"
                                                onClick={() => dispatch(openTab({
                                                    id: docId,
                                                    title: `Exhibit ${index + 1}`,
                                                    type: 'doc',
                                                    url: storageService.getFileView(docId).toString()
                                                }))}
                                            >
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-0.5">Exhibit {index + 1}</p>
                                                <p className="text-xs font-bold text-base-content group-hover:text-primary transition-colors">Mount to Workspace</p>
                                            </div>
                                            <a
                                                href={storageService.getFileView(docId).toString()}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 text-base-content/20 hover:text-primary transition-colors"
                                                title="Open in new window"
                                            >
                                                <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {!lesson.document_ids?.length && (
                            <div className="py-20 flex flex-col items-center justify-center text-base-content/10">
                                <HiOutlineDocumentDuplicate className="w-12 h-12 mb-4 opacity-50" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Exhibits Provided</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
