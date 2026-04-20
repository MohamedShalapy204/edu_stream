import { useGetCourses, CourseHero, CourseGrid } from '@/features/courses';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CoursesPage: React.FC = () => {
    const { t } = useTranslation();
    const CATEGORIES = ['All', 'Development', 'Business', 'Design', 'Marketing', 'Personal Development'];

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: courses, isLoading, error } = useGetCourses();

    const filteredCourses = useMemo(() => {
        if (!courses?.documents) return [];
        return courses.documents.filter(course => {
            const matchesCategory = selectedCategory === 'All' ||
                course.categories?.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [courses, selectedCategory, searchQuery]);

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-error/5 rounded-2xl flex items-center justify-center text-error mb-6">
                    <span className="text-2xl font-black">!</span>
                </div>
                <h3 className="text-xl font-heading font-black text-base-content mb-2">{t('courses.errorTitle')}</h3>
                <p className="text-sm font-medium text-base-content/40 max-w-xs">
                    {t('courses.errorDesc')}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg ring-1 ring-white/20 whitespace-nowrap"
                >
                    {t('courses.retry')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col animate-in fade-in duration-1000">
            {/* Editorial Header */}
            <CourseHero
                title={t('courses.title')}
                subtitle={t('courses.subtitle')}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={CATEGORIES.map(cat => ({ id: cat, label: t(`courses.categories.${cat}`) }))}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            {/* Curated Wisdom Results */}
            <div className="py-12 md:py-20 relative">
                {/* Visual anchor / section gradient */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

                <div className="flex items-center gap-3 mb-12 px-2 relative z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                        {t('courses.recordsIdentified', { count: filteredCourses.length })}
                    </span>
                    <div className="flex-1 h-px bg-primary/10 ml-4" />
                </div>

                <CourseGrid
                    courses={filteredCourses}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default CoursesPage;
