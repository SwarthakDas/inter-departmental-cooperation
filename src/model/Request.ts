import {Document, Schema} from "mongoose";
import EmployeeModel, { Employee } from "./Employee";
import DepartmentModel, { Department} from "./Department";

export interface Request extends Document{
    id: number,
    department: Department[],
    employee: Employee[],
    tools: string[],
    content: string,
    createdAt: Date,
}

export const RequestSchema: Schema<Request>= new Schema({
    id:{
        type: Number,
        required: [true, "request id is required"],
        unique: true
    },
    department:[DepartmentModel],
    employee:[EmployeeModel],
    tools: [{
        type: String
    }],
    content:{
        type: String
    },
    createdAt:{
        type: Date,
        required: true
    }
})
