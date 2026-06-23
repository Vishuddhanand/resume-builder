export interface ApiResponse {
    success: boolean;
    message: string;
    data?: object;
    error?: string,
    user?: {
        _id: string;
        name: string;
        email: string;
    }
}