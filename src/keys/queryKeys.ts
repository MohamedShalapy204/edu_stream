export const queryKeys = {
    auth: {
        session: ['auth', 'session'] as const,
    },
    users: {
        current: ['users', 'current'] as const,
    },
    courses: {
        all: ['courses'] as const,
        list: (filters: Record<string, unknown>) =>
            ['courses', 'list', filters] as const,
        detail: (id: string) => ['courses', 'detail', id] as const,
        byTeacher: (teacherId: string) =>
            ['courses', 'teacher', teacherId] as const,
        publicByTeacher: (teacherId: string) =>
            ['courses', 'publicTeacher', teacherId] as const,
    },
    sections: {
        byCourse: (courseId: string) => ['sections', courseId] as const,
    },
    lessons: {
        bySection: (sectionId: string) => ['lessons', sectionId] as const,
    },
    subscriptions: {
        mine: ['subscriptions', 'mine'] as const,
        check: (courseId: string) => ['subscriptions', 'check', courseId] as const,
        byCourse: (courseId: string) =>
            ['subscriptions', 'course', courseId] as const,
    },
    payments: {
        mine: ['payments', 'mine'] as const,
    },
    reviews: {
        byCourse: (courseId: string) => ['reviews', courseId] as const,
    },
    notifications: {
        mine: ['notifications', 'mine'] as const,
        unreadCount: ['notifications', 'unread'] as const,
    },
} as const;
