import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {departmentName,departmentCode, officialEmail, password,info, contact, address, pinCode}= await request.json()

        const existingDeptExistByName= await DepartmentModel.findOne({
            departmentCode,
            isVerified: true
        })

        if(existingDeptExistByName){
            return Response.json({
                sucess: false,
                message: "Department with this code already exists"
            }, {status: 400})
        }

        const existingDeptByEmail= await DepartmentModel.findOne({officialEmail})

        if(existingDeptByEmail){
            if(existingDeptByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already exists"
                },{status: 400})
            }
            else{
                return Response.json({
                    success: false,
                    message: "Department verification pending"
                },{status: 501})
            }
        }else{
            const hashedPassword= await bcrypt.hash(password,10)
            const newDept= new DepartmentModel({
                departmentName,
                departmentCode,
                officialEmail,
                password: hashedPassword,
                info,
                employees:[],
                conflicts: [],
                projects: [],
                invites:[],
                pendingRequest: [],
                inventory: [],
                isVerified: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                contact,
                address,
                pinCode
            })
            await newDept.save()
        }

        return Response.json({
            success: true,
            message:"Department registered successfully. Please await for verification and OTP"
        },{status: 201})

    } catch (error) {
        console.log("Error registering department",error);
        return Response.json({
            success: false,
            message: "Error registering department"
        },{status: 500})
    }
}