import mongoose,{Document, Schema} from "mongoose";

export interface Employee extends Document{
    name: string,
    email: string,
    password: string,
    underDepartment: mongoose.Types.ObjectId,
    notifications:string[]
}

const EmployeeSchema: Schema<Employee> =new Schema({
    name:{
        type: String,
        required: [true,"Name is required"],
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
    notifications:[{
        type: String
    }]
})


const EmployeeModel= (mongoose.models.Employee as mongoose.Model<Employee>) || mongoose.model<Employee>("Employee",EmployeeSchema)

export default EmployeeModel