import React, { useState } from 'react';
import { useGetCourses } from '../../hooks/useCourses';
import { CourseCard } from '../../components/courses/CourseCard';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';

const CATEGORIES = ['All', 'Development', 'Business', 'Design', 'Marketing', 'Personal Development'];

const CoursesPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: courses, isLoading, error } = useGetCourses();

    const filteredCourses = courses?.documents.filter(course => {
        const matchesCategory = selectedCategory === 'All' || course.categories?.includes(selectedCategory.toLowerCase());
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <p className="text-red-500 font-bold">Failed to load courses. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header / Intro */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Explore Our <span className="text-blue-600">Courses</span>
                </h1>
                <p className="text-slate-500 text-sm max-w-2xl font-medium">
                    Unlock your potential with premium courses taught by industry experts. Join thousands of students today.
                </p>
            </div>

            {/* Toolbar: Search + Categories */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-slate-100 pb-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search for courses, skills, or teachers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border border-transparent focus:border-blue-500/50 focus:bg-white rounded-xl text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Categories Scrollable (Native) */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                whitespace-nowrap px-4 py-2 text-xs font-bold rounded-full transition-all border
                                ${selectedCategory === cat
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                <SlidersHorizontal size={12} strokeWidth={3} />
                <span>Found {filteredCourses?.length || 0} Results</span>
            </div>

            {/* Course Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-slate-100 h-[380px] rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredCourses?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-3xl border border-dotted border-slate-200 text-center">
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                        <BookOpen size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">No Courses Found</h3>
                    <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses?.map((course) => (
                        <CourseCard key={course.$id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
