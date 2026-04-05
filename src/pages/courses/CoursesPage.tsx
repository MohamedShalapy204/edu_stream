import React, { useState, useMemo } from 'react';
import { useGetCourses, CourseHero, CourseGrid } from '@/features/courses';

const CATEGORIES = ['All', 'Development', 'Business', 'Design', 'Marketing', 'Personal Development'];

const CoursesPage: React.FC = () => {
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
                <h3 className="text-xl font-heading font-black text-base-content mb-2">Knowledge Access Restricted</h3>
                <p className="text-sm font-medium text-base-content/40 max-w-xs">
                    Failed to synchronize with the Atheneum records. Please attempt a reconnection.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg ring-1 ring-white/20 whitespace-nowrap"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col animate-in fade-in duration-1000">
            {/* Editorial Header */}
            <CourseHero
                title="Consolidated Wisdom"
                subtitle="Unlock your potential with premium courses taught by industry experts. Join thousands of students today."
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            {/* Curated Wisdom Results */}
            <div className="container mx-auto px-6 lg:px-12 py-20 bg-slate-50/30">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30">
                        {filteredCourses.length} Records Identified
                    </span>
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
