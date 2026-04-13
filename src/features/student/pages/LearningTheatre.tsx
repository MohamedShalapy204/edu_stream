import { useState, useMemo, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HiOutlineArrowLeft, HiOutlineBars3BottomLeft, HiOutlineBars3BottomRight, HiOutlineXMark } from 'react-icons/hi2';

import { useGetCourseById } from '@/features/courses/hooks/useCourseActions';
import { useGetSections } from '@/hooks/useSections';
import { useGetLessonsByCourse } from '@/hooks/useLessons';
import type { ILesson, ISection } from '@/features/courses';

import { useCurrentAccount } from '@/features/auth';
import { useGetStudentProgress, useMarkLessonComplete, useUpdateLastAccessed } from '../hooks/useStudent';
import type { ICourseProgress } from '../types';

import { CurriculumSidebar } from '../components/CurriculumSidebar';
import { TheatrePlayer } from '../components/TheatrePlayer';
import { DocumentHub } from '../components/DocumentHub';
import DocumentController from '../components/LearningTheatre/DocumentController';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useEffect } from 'react';
import { resetTheatre } from '../store/learningTheatreSlice';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const LearningTheatre: FC = () => {
    const { id: courseId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: user } = useCurrentAccount();
    const isMobile = useMediaQuery('(max-width: 1024px)');

    const { data: course, isLoading: isCourseLoading } = useGetCourseById(courseId || '');
    const { data: sections, isLoading: isSectionsLoading } = useGetSections(courseId || '');
    const { data: lessonsData, isLoading: isLessonsLoading } = useGetLessonsByCourse(courseId || '');

    const lessons = useMemo<ILesson[]>(() => lessonsData?.documents || [], [lessonsData]);
    const sectionList = useMemo<ISection[]>(() => sections?.documents || [], [sections]);

    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(!isMobile);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    // Sync sidebar state on resize
    useEffect(() => {
        if (!isMobile) {
            setIsLeftSidebarOpen(true);
        } else {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
        }
    }, [isMobile]);

    // Redux State for Learning Theatre
    const dispatch = useAppDispatch();
    const { openDocuments } = useAppSelector((state) => state.learningTheatre.documents);
    const isWorkspaceActive = openDocuments.length > 0;

    // Progress Hooks
    const { data: allProgress } = useGetStudentProgress(user?.$id);
    const markCompleteMu = useMarkLessonComplete(user?.$id || '');
    const updateAccessMu = useUpdateLastAccessed(user?.$id || '');

    const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(undefined);

    const isLoading = isCourseLoading || isSectionsLoading || isLessonsLoading;

    // Isolate progress for current course
    const courseProgress = useMemo<ICourseProgress>(() =>
        (courseId && allProgress?.[courseId]) || { completed_lessons: [] }
        , [allProgress, courseId]);

    // Derived active lesson
    const activeLessonId = useMemo(() => {
        if (selectedLessonId) return selectedLessonId;
        if (isLoading || lessons.length === 0) return undefined;

        const sorted = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0));
        const last = courseProgress.last_accessed_lesson;

        if (last && sorted.find(l => l.$id === last)) {
            return last;
        }
        return sorted[0].$id;
    }, [selectedLessonId, isLoading, lessons, courseProgress.last_accessed_lesson]);

    // Reset theatre state when lesson changes
    useEffect(() => {
        if (activeLessonId) {
            dispatch(resetTheatre());
        }
    }, [activeLessonId, dispatch]);

    const handleLessonSelect = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        if (isMobile) setIsLeftSidebarOpen(false);
        if (courseId) {
            updateAccessMu.mutate({ courseId, lessonId });
        }
    };

    const handleMarkComplete = () => {
        if (courseId && activeLessonId) {
            markCompleteMu.mutate({ courseId, lessonId: activeLessonId });
        }
    };

    const handleNextLesson = () => {
        if (lessons.length === 0 || !activeLessonId) return;
        const sortedLessons = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0));
        const currentIndex = sortedLessons.findIndex(l => l.$id === activeLessonId);

        if (currentIndex !== -1 && currentIndex < sortedLessons.length - 1) {
            handleLessonSelect(sortedLessons[currentIndex + 1].$id);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50">
                <span role="progressbar" className="loading loading-spinner text-primary loading-lg" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50 flex-col gap-6">
                <h1 className="text-3xl font-heading font-black tracking-tight">Course Not Found</h1>
                <button onClick={() => navigate('/student/dashboard', { viewTransition: true })} className="btn btn-primary rounded-full">Return Home</button>
            </div>
        );
    }

    const activeLesson = lessons.find(l => l.$id === activeLessonId);
    const isCompleted = activeLessonId ? courseProgress.completed_lessons.includes(activeLessonId) : false;

    return (
        <div className="fixed inset-0 z-50 bg-base-200 flex overflow-hidden">
            {/* ── STAGE CONTROLS ─────────────────────────────────────────── */}
            <div className="absolute top-4 md:top-6 left-4 md:left-6 z-60 flex gap-2 md:gap-3">
                <button
                    onClick={() => navigate('/student/dashboard', { viewTransition: true })}
                    className="h-10 md:h-12 px-4 md:px-6 bg-primary text-primary-content rounded-full flex items-center gap-2 md:gap-3 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:-translate-y-1 hover:shadow-primary/30 active:scale-95 transition-all group border-none"
                >
                    <HiOutlineArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden xs:inline">Exit Theatre</span>
                </button>

                <button
                    onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center shadow-xl backdrop-blur-xl border transition-all duration-300 active:scale-95
                        ${isLeftSidebarOpen 
                            ? 'bg-primary text-primary-content border-primary/20' 
                            : 'bg-white/80 border-white text-base-content hover:bg-white'}`}
                >
                    {isLeftSidebarOpen ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3BottomLeft className="w-5 h-5" />}
                </button>
            </div>

            <div className="absolute top-4 md:top-6 right-4 md:right-6 z-60">
                <button
                    onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center shadow-xl backdrop-blur-xl border transition-all duration-300 active:scale-95
                        ${isRightSidebarOpen 
                            ? 'bg-primary text-primary-content border-primary/20' 
                            : 'bg-white/80 border-white text-base-content hover:bg-white'}`}
                >
                    {isRightSidebarOpen ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3BottomRight className="w-5 h-5" />}
                </button>
            </div>

            {/* ── CURRICULUM OVERLAY/SIDEBAR ───────────────────────────────── */}
            <AnimatePresence initial={false}>
                {isLeftSidebarOpen && (
                    <motion.div
                        initial={{ x: -400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -400, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`h-screen bg-base-100 border-r border-base-content/5 shadow-2xl overflow-hidden pt-20 md:pt-24 z-50
                            ${isMobile ? 'fixed inset-0 w-full' : 'relative w-96'}`}
                    >
                        {/* Visual gradient backdrop */}
                        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
                        
                        <div className="relative h-full z-10 flex flex-col w-full">
                            <div className="p-6 md:p-8 pb-4">
                                <h1 className="text-xl md:text-2xl font-heading font-black text-base-content tracking-tight line-clamp-2 italic">{course.title}</h1>
                            </div>
                            <div className="flex-1 min-h-0">
                                <CurriculumSidebar
                                    sections={sectionList}
                                    lessons={lessons}
                                    activeLessonId={activeLessonId}
                                    onSelectLesson={handleLessonSelect}
                                    progress={courseProgress}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MAIN STAGE ─────────────────────────────────────────────── */}
            <div className="flex-1 h-screen bg-base-200 p-3 md:p-8 md:pt-24 flex items-center justify-center relative overflow-hidden transition-all duration-500">
                {/* Ambient stage glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[160px] opacity-40" />
                </div>
                
                <div
                    className={`w-full h-full max-w-full mx-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-white/20 bg-base-100/50 backdrop-blur-xl flex relative z-10 overflow-hidden 
                        ${isWorkspaceActive ? 'flex-col lg:flex-row' : 'flex-col'}`}
                    style={courseId ? { viewTransitionName: `course-thumbnail-${courseId}` } as React.CSSProperties : undefined}
                >
                    {activeLesson ? (
                        <>
                            <div className={`transition-all duration-500 flex flex-col ${isWorkspaceActive ? 'h-1/2 lg:h-full lg:w-1/2' : 'h-full w-full'
                                }`}>
                                <TheatrePlayer
                                    lesson={activeLesson}
                                    isCompleted={isCompleted}
                                    onMarkCompleted={handleMarkComplete}
                                    onNextLesson={handleNextLesson}
                                />
                            </div>

                            {isWorkspaceActive && (
                                <div className={`animate-in fade-in slide-in-from-right-4 duration-500 
                                    ${isMobile ? 'h-1/2 border-t border-base-content/5' : 'h-full lg:w-1/2 lg:p-4'}`}>
                                    <DocumentController />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-base-content/30 p-8 md:p-12 text-center">
                            <h2 className="text-2xl md:text-3xl font-heading font-black mb-4 tracking-tight">Select a Segment</h2>
                            <p className="text-xs md:text-sm font-medium leading-relaxed max-w-sm">Choose a lesson from the curriculum index to begin your study session.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── WORKSPACE HUB OVERLAY ──────────────────────────────────── */}
            <AnimatePresence initial={false}>
                {isRightSidebarOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`h-screen bg-base-100 border-l border-base-content/5 shadow-2xl overflow-hidden pt-20 md:pt-24 z-50
                            ${isMobile ? 'fixed inset-0 w-full' : 'relative w-96'}`}
                    >
                        <div className="absolute inset-x-0 top-20 md:top-24 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
                        
                        <div className="relative h-full z-10 flex flex-col w-full">
                            {activeLesson && (
                                <DocumentHub lesson={activeLesson} />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LearningTheatre;
