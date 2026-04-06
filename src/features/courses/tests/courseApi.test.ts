import { describe, it, expect, vi, beforeEach } from 'vitest';
import { courseApi } from '../api/courseApi';
import { databases } from '@/services/appwrite/config';
import { ID, Query } from 'appwrite';

vi.mock('@/services/appwrite/config', () => ({
    databases: {
        listDocuments: vi.fn(),
        getDocument: vi.fn(),
        createDocument: vi.fn(),
        updateDocument: vi.fn(),
        deleteDocument: vi.fn(),
    },
    appwriteConfig: {
        databaseId: 'test-db',
        coursesCollectionId: 'courses-col',
    },
}));

describe('courseApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockCourse = {
        $id: 'course-1',
        title: 'Mastering AI',
        instructor_id: 'inst-1',
        description: 'Learn everything about AI',
        price: 99.99,
        is_published: true,
        $createdAt: '2023-01-01',
        $updatedAt: '2023-01-01',
        $permissions: [],
        $databaseId: 'test-db',
        $collectionId: 'courses-col',
    };

    describe('listCourses', () => {
        it('should fetch a list of courses', async () => {
            const mockList = { total: 1, documents: [mockCourse] };
            vi.mocked(databases.listDocuments).mockResolvedValue(mockList as any);

            const result = await courseApi.listCourses();

            expect(databases.listDocuments).toHaveBeenCalledWith(
                'test-db',
                'courses-col',
                expect.arrayContaining([expect.stringContaining('$createdAt')])
            );
            expect(result.total).toBe(1);
            expect(result.documents[0].title).toBe('Mastering AI');
        });
    });

    describe('getCourse', () => {
        it('should fetch a single course by ID', async () => {
            vi.mocked(databases.getDocument).mockResolvedValue(mockCourse as any);

            const result = await courseApi.getCourse('course-1');

            expect(databases.getDocument).toHaveBeenCalledWith('test-db', 'courses-col', 'course-1');
            expect(result.$id).toBe('course-1');
        });
    });

    describe('createCourse', () => {
        it('should create a new course document', async () => {
            vi.mocked(databases.createDocument).mockResolvedValue(mockCourse as any);
            const courseInput = {
                title: 'Mastering AI',
                instructor_id: 'inst-1',
                price: 99.99,
                is_published: true,
            };

            const result = await courseApi.createCourse(courseInput as any);

            expect(databases.createDocument).toHaveBeenCalledWith(
                'test-db',
                'courses-col',
                expect.any(String),
                courseInput
            );
            expect(result.$id).toBe('course-1');
        });
    });

    describe('updateCourse', () => {
        it('should update an existing course', async () => {
            vi.mocked(databases.updateDocument).mockResolvedValue({ ...mockCourse, title: 'Updated Title' } as any);

            const result = await courseApi.updateCourse('course-1', { title: 'Updated Title' });

            expect(databases.updateDocument).toHaveBeenCalledWith(
                'test-db',
                'courses-col',
                'course-1',
                { title: 'Updated Title' }
            );
            expect(result.title).toBe('Updated Title');
        });
    });

    describe('deleteCourse', () => {
        it('should delete a course document', async () => {
            vi.mocked(databases.deleteDocument).mockResolvedValue({} as any);

            await courseApi.deleteCourse('course-1');

            expect(databases.deleteDocument).toHaveBeenCalledWith('test-db', 'courses-col', 'course-1');
        });
    });
});
