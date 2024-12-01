import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import EmployeeModel from "@/model/Employee";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {name,email,password,departmentCode}= await request.json()
        const existingEmail= await EmployeeModel.findOne({email})

        if(existingEmail){
            return Response.json({
                success: false,
                message: "Employee with this email already exists"
            },{status: 500})
        }

        const hashedPassword= await bcrypt.hash(password,10)
        const underDepartment=await DepartmentModel.findOne({departmentCode})
        if(!underDepartment){
            return Response.json({
                success: false,
                message: "Invalid department code"
            },{status: 500})
        }
        const newEmployee= new EmployeeModel({
            name,
            email,
            password: hashedPassword,
            underDepartment: underDepartment,
            notifications:[]
        })
        await newEmployee.save()
        await DepartmentModel.findOneAndUpdate(
            {departmentCode},
            {$push:{employees:{name:name,employeeDetails:newEmployee._id}}},
            { new: true, upsert: false }
        )
        return Response.json({
            success: true,
            message: "Employee registered successfully"
        },{status: 201})
    } catch (error) {
        console.log("Error registering employee",error);
        return Response.json({
            success: false,
            message: "error registering employee"
        },{status: 500})
    }
}