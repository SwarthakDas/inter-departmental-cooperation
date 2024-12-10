export interface ApiResponse{
    success: boolean;
    message: string;
    employees?: Array<string>;
    conflicts?: Array<object>;
    employeeName?: string;
    underDepartment?: string;
    departmentName?: string;
    departmentCode?: string;
    departmentEmail?: string;
    departmentInfo?: string;
    departmentContact?: number;
    departmentAddress?: string;
    sameAreaDepartments?: Array<string>;
    departmentNames?: Array<string>;
    inventory?: Array<object>;
    projects?: Array<object>;
    departmentStats?: Array<object>;
    receivedMessages?: Array<object>;
    sentMessages?: Array<object>;
    meetings?:Array<object>;
    invites?:Array<object>;
}