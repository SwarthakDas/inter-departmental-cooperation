import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {deptname, email, password,info}= await request.json()

        const existingDeptExistByName= await DepartmentModel.findOne({
            deptname,
            isVerified: true
        })

        if(existingDeptExistByName){
            return Response.json({
                sucess: false,
                message: "Department username already exists"
            }, {status: 400})
        }

        const existingDeptByEmail= await DepartmentModel.findOne({email})
        const verifyCode=Math.floor(100000+Math.random()*900000).toString()

        if(existingDeptByEmail){
            if(existingDeptByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already exists"
                },{status: 400})
            }
            else{
                const hashedPassword= await bcrypt.hash(password,10)
                existingDeptByEmail.password=hashedPassword;
                existingDeptByEmail.verifyCode=verifyCode
                await existingDeptByEmail.save()
            }
        }else{
            const hashedPassword= await bcrypt.hash(password,10)
            const newDept= new DepartmentModel({
                deptname,
                email,
                password: hashedPassword,
                info,
                employees:[],
                invites: [],
                conflicts: [],
                projects: [],
                pendingRequest: [],
                tools: [],
                isVerified: false,
                verifyCode
            })
            await newDept.save()
        }
        //TODO: implement resendEmail

    } catch (error) {
        console.log("Error registering department",error);
        return Response.json({
            success: false,
            message: "Error regitering department"
        },{status: 500})
    }
}