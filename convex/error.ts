import { ConvexError, type Value } from 'convex/values';

// Define the error catalog with specific data shape
export interface ErrorData {
    code: string;
    message: string;
    [key: string]: Value | undefined;
}

export const ERROR_CATALOG = {
    USER_NOT_FOUND: {
        code: 'USER_NOT_FOUND',
        message: 'User not found',
    },
    NOT_AUTHENTICATED: {
        code: 'NOT_AUTHENTICATED',
        message: 'User not authenticated',
    },
} as const;

type ErrorCode = keyof typeof ERROR_CATALOG;

// Custom wrapper for throwing ConvexError with catalog support
export class AppConvexError extends ConvexError<ErrorData> {
    constructor(code: ErrorCode, dynamicMessage?: string) {
        const defaultData = ERROR_CATALOG[code];
        const data = dynamicMessage
            ? { ...defaultData, message: dynamicMessage } // Override message if provided
            : defaultData;
        super(data);
    }
}