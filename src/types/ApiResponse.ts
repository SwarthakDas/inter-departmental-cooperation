export interface ApiResponse{
    success: boolean;
    message: string;
    employees?: Array<string>;
    employeeName?: string;
    underDepartment?: string;
}