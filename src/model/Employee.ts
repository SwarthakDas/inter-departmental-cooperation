import mongoose,{Document, Schema} from "mongoose";
import DepartmentModel, { Department } from "./Department";

export interface Employee extends Document{
    username: string,
    email: string,
    password: string,
    underDepartment: Department[],
}

const EmployeeSchema: Schema<Employee> =new Schema({
    username:{
        type: String,
        required: [true,"Username is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true,"email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true,"password is required"],
    },
    underDepartment:[DepartmentModel]
})


const EmployeeModel= (mongoose.models.Employee as mongoose.Model<Employee>) || mongoose.model<Employee>("Employee",EmployeeSchema)

export default EmployeeModel