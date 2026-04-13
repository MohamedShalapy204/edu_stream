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
    vodafoneEnrollments: {
        all: ['vodafone_enrollments'] as const,
        byCourse: (courseId: string) => ['vodafone_enrollments', 'course', courseId] as const,
        byStudent: (studentId: string) => ['vodafone_enrollments', 'student', studentId] as const,
        check: (courseId: string, studentId: string) =>
            ['vodafone_enrollments', 'check', courseId, studentId] as const,
        allPendingByTeacher: (teacherId: string) =>
            ['vodafone_enrollments', 'pending', teacherId] as const,
    },
} as const;
