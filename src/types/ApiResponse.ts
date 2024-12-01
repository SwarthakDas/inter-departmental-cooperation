export interface ApiResponse{
    success: boolean;
    message: string;
    employees?: Array<string>;
    employeeName?: string;
    underDepartment?: string;
    departmentName?: string;
    departmentCode?: string;
    departmentEmail?: string;
    departmentInfo?: string;
    departmentContact?: number;
    departmentAddress?: string;
}