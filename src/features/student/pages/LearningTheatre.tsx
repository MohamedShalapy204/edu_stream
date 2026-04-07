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

const LearningTheatre: FC = () => {
    const { id: courseId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: user } = useCurrentAccount();

    const { data: course, isLoading: isCourseLoading } = useGetCourseById(courseId || '');
    const { data: sections, isLoading: isSectionsLoading } = useGetSections(courseId || '');
    const { data: lessonsData, isLoading: isLessonsLoading } = useGetLessonsByCourse(courseId || '');

    const lessons = useMemo<ILesson[]>(() => lessonsData?.documents || [], [lessonsData]);
    const sectionList = useMemo<ISection[]>(() => sections?.documents || [], [sections]);

    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

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

    // Derived active lesson: User selection takes precedence, then last accessed, then first lesson
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

    const handleLessonSelect = (lessonId: string) => {
        setSelectedLessonId(lessonId);
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
                <span className="loading loading-spinner text-primary loading-lg" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50 flex-col gap-6">
                <h1 className="text-3xl font-heading font-black tracking-tight">Course Not Found</h1>
                <button onClick={() => navigate('/student/dashboard')} className="btn btn-primary rounded-full">Return Home</button>
            </div>
        );
    }

    const activeLesson = lessons.find(l => l.$id === activeLessonId);
    const isCompleted = activeLessonId ? courseProgress.completed_lessons.includes(activeLessonId) : false;

    return (
        <div className="fixed inset-0 z-50 bg-base-200 flex overflow-hidden">
            {/* Left Control Strip */}
            <div className="absolute top-6 left-6 z-60 flex gap-3">
                <button
                    onClick={() => navigate('/student/dashboard')}
                    className="h-12 px-6 bg-base-content text-white rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 transition-all group"
                >
                    <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Exit Theatre
                </button>

                <button
                    onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                    className="h-12 w-12 bg-white/80 backdrop-blur-xl border border-white text-base-content rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all active:scale-95"
                    title={isLeftSidebarOpen ? "Maximize Stage" : "Show Curriculum"}
                >
                    {isLeftSidebarOpen ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3BottomLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* Right Control Strip */}
            <div className="absolute top-6 right-6 z-60">
                <button
                    onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                    className="h-12 w-12 bg-white/80 backdrop-blur-xl border border-white text-base-content rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all active:scale-95"
                    title={isRightSidebarOpen ? "Maximize Stage" : "Show Workspace"}
                >
                    {isRightSidebarOpen ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3BottomRight className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar Left (Curriculum) */}
            <AnimatePresence initial={false}>
                {isLeftSidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 384, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="h-screen bg-base-100 border-r border-base-content/5 relative shadow-2xl overflow-hidden pt-24"
                    >
                        {/* Visual gradient backdrop */}
                        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

                        <div className="relative h-full z-10 flex flex-col w-96">
                            <div className="p-8 pb-4">
                                <h1 className="text-xl font-heading font-black text-base-content tracking-tight line-clamp-2">{course.title}</h1>
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

            {/* Main Stage Center */}
            <div className="flex-1 h-screen bg-black/5 p-4 md:p-8 md:pt-24 flex items-center justify-center relative overflow-hidden transition-all duration-500">
                <div className="w-full h-full max-w-(--breakpoint-2xl) mx-auto rounded-[3rem] shadow-2xl border border-white/20 bg-base-100/50 backdrop-blur-xl flex flex-col relative z-10 overflow-hidden">
                    {activeLesson ? (
                        <TheatrePlayer
                            lesson={activeLesson}
                            isCompleted={isCompleted}
                            onMarkCompleted={handleMarkComplete}
                            onNextLesson={handleNextLesson}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-base-content/30 p-12 text-center">
                            <h2 className="text-3xl font-heading font-black mb-4 tracking-tight">Select a Segment</h2>
                            <p className="text-sm font-medium leading-relaxed max-w-sm">Choose a lesson from the curriculum index to begin your study session.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Right (Document Hub) */}
            <AnimatePresence initial={false}>
                {isRightSidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 384, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="h-screen bg-base-100 border-l border-base-content/5 relative shadow-2xl overflow-hidden pt-24"
                    >
                        {/* Visual gradient backdrop */}
                        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

                        <div className="relative h-full z-10 flex flex-col w-96">
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

