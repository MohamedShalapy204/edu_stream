import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/keys/queryKeys';
import { createEnrollment, getEnrollmentForCourse } from '../api/vodafoneEnrollmentApi';
import { storageService } from '@/services/appwrite/storage/storageService';
import { VodafoneEnrollmentStatus } from '../types';

export function useCourseEnrollmentStatus(courseId: string, studentId: string) {
    return useQuery({
        queryKey: queryKeys.vodafoneEnrollments.check(courseId, studentId),
        queryFn: () => getEnrollmentForCourse(courseId, studentId),
        enabled: !!courseId && !!studentId,
    });
}

interface SubmitReceiptData {
    courseId: string;
    studentId: string;
    receiptImage: File;
    paymentNumberShown: string;
}

export function useSubmitVodafoneReceipt() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SubmitReceiptData) => {
            // 1. Upload receipt to storage
            const fileDoc = await storageService.uploadFile(data.receiptImage);
            
            // 2. Create enrollment record
            return await createEnrollment({
                course_id: data.courseId,
                student_id: data.studentId,
                status: VodafoneEnrollmentStatus.PENDING,
                payment_number_shown: data.paymentNumberShown,
                receipt_image_id: fileDoc.$id,
                receipt_image_url: storageService.getFilePreview(fileDoc.$id).toString(),
            });
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.vodafoneEnrollments.check(variables.courseId, variables.studentId)
            });
        }
    });
}
