import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import EmployeeModel from "@/model/Employee";
import { ObjectId } from 'mongoose';

export async function POST(request: Request){
    await dbConnect()
    try {
        const {email,password}= await request.json()
        const employee= await EmployeeModel.findOne({email})
        if(!employee){
            return Response.json({
                success: false,
                message: "No employee exists with this email"
            },{status: 500})
        }
        const checkPassword=await bcrypt.compare(password,employee.password)
        if(!checkPassword){
            return Response.json({
                success: false,
                message: "Incorrect Password"
            },{status: 400})
        }
        return Response.json({
            success: true,
            message: (employee._id as ObjectId).toString()
        },{status: 200})
    } catch (error) {
        console.log("Error signing employee",error);
        return Response.json({
            success: false,
            message: "error signing employee"
        },{status: 500})
    }
}