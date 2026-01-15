import Log from '@/models/Log';
import connectToDatabase from '@/lib/db';

export const logAction = async (
    action: string,
    details?: Record<string, any>,
    userId?: string,
    ip?: string
) => {
    try {
        await connectToDatabase();
        await Log.create({
            action,
            details,
            userId,
            ip,
        });
    } catch (error) {
        console.error('Failed to write log:', error);
        // Non-blocking, don't throw
    }
};
