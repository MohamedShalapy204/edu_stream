import { describe, it, expect, vi, beforeEach } from 'vitest';
import { courseApi } from '../api/courseApi';
import { databases } from '@/services/appwrite/config';
import { storageService } from '@/services/appwrite/storage/storageService';

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

vi.mock('@/services/appwrite/storage/storageService', () => ({
    storageService: {
        uploadFile: vi.fn(),
        getFilePreview: vi.fn(),
        deleteFile: vi.fn(),
    }
}));

describe('courseApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockCourse = {
        $id: 'course-1',
        title: 'Mastering AI',
        teacher_id: 'teacher-1',
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
        });
    });

    describe('updateCourse', () => {
        it('should update and filter extra attributes', async () => {
            vi.mocked(databases.updateDocument).mockResolvedValue({ ...mockCourse } as any);

            await courseApi.updateCourse('course-1', {
                title: 'New Title',
                thumbnail: 'something' as any // Should be filtered if not File
            } as any);

            expect(databases.updateDocument).toHaveBeenCalledWith(
                'test-db',
                'courses-col',
                'course-1',
                { title: 'New Title' }
            );
        });

        it('should upload thumbnail if it is a File', async () => {
            const file = new File([''], 'test.png', { type: 'image/png' });
            vi.mocked(storageService.uploadFile).mockResolvedValue({ $id: 'file-123' } as any);
            vi.mocked(storageService.getFilePreview).mockReturnValue('http://preview-url' as any);
            vi.mocked(databases.updateDocument).mockResolvedValue(mockCourse as any);

            await courseApi.updateCourse('course-1', {
                title: 'New Title',
                thumbnail: file
            } as any);

            expect(storageService.uploadFile).toHaveBeenCalledWith(file, expect.any(Function));
            expect(databases.updateDocument).toHaveBeenCalledWith(
                'test-db',
                'courses-col',
                'course-1',
                expect.objectContaining({
                    thumbnail_id: 'file-123',
                    thumbnail_url: 'http://preview-url'
                })
            );
        });
    });

    describe('deleteCourse', () => {
        it('should delete a course and its thumbnail if present', async () => {
            const courseWithThumb = { ...mockCourse, thumbnail_id: 'thumb-123' };
            vi.mocked(databases.getDocument).mockResolvedValue(courseWithThumb as any);
            vi.mocked(databases.deleteDocument).mockResolvedValue({} as any);

            await courseApi.deleteCourse('course-1');

            expect(databases.getDocument).toHaveBeenCalledWith('test-db', 'courses-col', 'course-1');
            expect(storageService.deleteFile).toHaveBeenCalledWith('thumb-123');
            expect(databases.deleteDocument).toHaveBeenCalledWith('test-db', 'courses-col', 'course-1');
        });
    });
});
