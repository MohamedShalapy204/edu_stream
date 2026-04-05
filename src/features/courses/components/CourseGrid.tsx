import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiOutlineAcademicCap } from 'react-icons/hi2';
import { CourseCard } from './CourseCard';
import type { ICourse } from '../types/courseTypes';

interface CourseGridProps {
    courses: ICourse[] | undefined;
    isLoading: boolean;
}

/**
 * 🏛️ CourseGrid
 * 
 * A responsive grid for displaying a collection of scholarship tiles.
 * Includes integrated skeletal states and empty-state placeholders.
 */
export const CourseGrid: React.FC<CourseGridProps> = ({ courses, isLoading }) => {

    // Skeletal Placeholder State
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-16/22 bg-white shadow-premium rounded-[2.5rem] animate-pulse border border-base-content/5" />
                ))}
            </div>
        );
    }

    // Empty State (No Wisdom Found)
    if (!courses || courses.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-32 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-dashed border-base-content/10 text-center"
            >
                <div className="w-20 h-20 bg-primary/5 rounded-4xl flex items-center justify-center text-primary/30 mb-8">
                    <HiOutlineAcademicCap className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-heading font-black text-base-content tracking-tight mb-2">No Wisdom Found</h3>
                <p className="text-sm font-medium text-base-content/40 max-w-xs">
                    The Atheneum is currently devoid of records matching your inquiry. Try broadening your domain of study.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            <AnimatePresence mode="popLayout">
                {courses.map((course) => (
                    <CourseCard key={course.$id} course={course} />
                ))}
            </AnimatePresence>
        </div>
    );
};
