import { Employee } from "@/model/Employee";

export interface ApiResponse{
    success: boolean;
    message: string;
    employees: Array<Employee>;
}