import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '../../src/services/appwrite/auth/authService';
import { account } from '../../src/services/appwrite/config';
import { AppwriteException } from 'appwrite';

vi.mock('../../src/services/appwrite/config', () => ({
    account: {
        create: vi.fn(),
        createEmailPasswordSession: vi.fn(),
        deleteSession: vi.fn(),
        get: vi.fn(),
        createRecovery: vi.fn(),
        updateRecovery: vi.fn(),
        createVerification: vi.fn(),
        updateVerification: vi.fn(),
    },
    appwriteConfig: {
        baseUrl: 'http://localhost:3000',
    },
}));

describe('authService (Minimalist Refactor)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockSdkUser = {
        $id: 'user-id',
        name: 'John',
        email: 'john@example.com',
        $createdAt: '2023-01-01T00:00:00.000Z',
        $updatedAt: '2023-01-01T00:00:00.000Z',
        emailVerification: false,
        phone: '',
        phoneVerification: false,
        status: true,
        labels: [],
        prefs: {}
    };

    const mockSdkSession = {
        $id: 'session-id',
        $createdAt: '2023-01-01T00:00:00.000Z',
        userId: 'user-id',
        expire: '2024-01-01T00:00:00.000Z',
        provider: 'email',
        providerUid: 'john@example.com',
        providerAccessToken: '',
        providerAccessTokenExpiry: '',
        providerRefreshToken: '',
        ip: '127.0.0.1',
        osCode: 'mac',
        osName: 'Mac',
        osVersion: '10.15',
        clientType: 'browser',
        clientCode: 'chrome',
        clientName: 'Chrome',
        clientVersion: '88',
        deviceBrand: 'Apple',
        deviceModel: 'Macbook',
        countryCode: 'US',
        countryName: 'United States',
        current: true
    };

    describe('createAccount', () => {
        it('should create account and return account data', async () => {
            vi.mocked(account.create).mockResolvedValue(mockSdkUser as any);

            const result = await authService.createAccount('John', 'john@example.com', 'password123');

            expect(account.create).toHaveBeenCalled();
            expect(result.$id).toBe('user-id');
        });

        it('should catch AppwriteException and re-throw', async () => {
            vi.mocked(account.create).mockRejectedValue(new AppwriteException('Conflict', 409));
            await expect(authService.createAccount('John', 'john@example.com', 'password123')).rejects.toThrow(AppwriteException);
        });
    });

    describe('login', () => {
        it('should call createEmailPasswordSession and return session data', async () => {
            vi.mocked(account.createEmailPasswordSession).mockResolvedValue(mockSdkSession as any);

            const result = await authService.login('john@example.com', 'password123');

            expect(account.createEmailPasswordSession).toHaveBeenCalled();
            expect(result.$id).toBe('session-id');
        });
    });

    describe('getAccount', () => {
        it('should return current account', async () => {
            vi.mocked(account.get).mockResolvedValue(mockSdkUser as any);
            const result = await authService.getCurrentAccount();
            expect(result.$id).toBe('user-id');
        });
    });
});
