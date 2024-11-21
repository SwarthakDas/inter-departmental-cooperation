import mongoose,{Document, Schema} from "mongoose";

export interface Employee extends Document{
    username: string,
    email: string,
    password: string,
    underDepartment: mongoose.Types.ObjectId,
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
    underDepartment:{
        type: Schema.Types.ObjectId,
        ref: "DepartmentModel",
        required: [true,"Department is required"],
    },
})


const EmployeeModel= (mongoose.models.Employee as mongoose.Model<Employee>) || mongoose.model<Employee>("Employee",EmployeeSchema)

export default EmployeeModel