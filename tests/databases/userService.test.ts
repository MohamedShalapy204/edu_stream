import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userService from '../../src/services/appwrite/databases/userService';
import { databases } from '../../src/services/appwrite/config';
import { UserRole } from '../../src/types';
import { AppwriteException } from 'appwrite';

vi.mock('../../src/services/appwrite/config', () => ({
    databases: {
        createDocument: vi.fn(),
        getDocument: vi.fn(),
        updateDocument: vi.fn(),
    },
    appwriteConfig: {
        databaseId: 'test-db',
        usersCollectionId: 'users-col',
    },
}));

describe('userService (Minimalist Refactor)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockUserDoc = {
        $id: 'user-id',
        $createdAt: '2023-01-01T00:00:00.000Z',
        $updatedAt: '2023-01-01T00:00:00.000Z',
        name: 'John',
        email: 'john@example.com',
        role: UserRole.STUDENT,
        avatar_url: '',
        bio: '',
    };

    describe('createUserDoc', () => {
        it('should create document and return IUser', async () => {
            vi.mocked(databases.createDocument).mockResolvedValue(mockUserDoc as any);

            const result = await userService.createUserDoc('user-id', {
                name: 'John',
                email: 'john@example.com',
                role: UserRole.STUDENT,
                avatar_url: '',
            });

            expect(databases.createDocument).toHaveBeenCalled();
            expect(result.$id).toBe('user-id');
            expect(result.role).toBe(UserRole.STUDENT);
        });

        it('should catch AppwriteException and re-throw', async () => {
            vi.mocked(databases.createDocument).mockRejectedValue(new AppwriteException('Conflict', 409));
            await expect(userService.createUserDoc('user-id', {
                name: 'John',
                email: 'john@example.com',
                role: UserRole.STUDENT
            })).rejects.toThrow(AppwriteException);
        });
    });

    describe('getUserDoc', () => {
        it('should fetch and return IUser', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            vi.mocked(databases.getDocument).mockResolvedValue(mockUserDoc as any);

            const result = await userService.getUserDoc('user-id');

            expect(databases.getDocument).toHaveBeenCalledWith('test-db', 'users-col', 'user-id');
            expect(result.name).toBe('John');
        });
    });

    describe('updateUserDoc', () => {
        it('should update and return IUser', async () => {
            const updatedDoc = { ...mockUserDoc, name: 'New Name' };
            vi.mocked(databases.updateDocument).mockResolvedValue(updatedDoc as any);

            const result = await userService.updateUserDoc('user-id', { name: 'New Name' });

            expect(databases.updateDocument).toHaveBeenCalled();
            expect(result.name).toBe('New Name');
        });
    });
});
