import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import { z } from "zod";
import { deptnameValidation } from "@/schemas/signUpSchema";
export const dynamic='force-dynamic';

const DeptCodeQuerySchema=z.object({
    departmentCode: deptnameValidation
})

export async function GET(request: Request){
    await dbConnect()

    try {
        const {searchParams}=new URL(request.url)
        const queryParam={
            departmentCode: searchParams.get('departmentCode')
        }

        const result=DeptCodeQuerySchema.safeParse(queryParam)
        console.log(result)

        if(!result.success){
            const deptCodeErrors=result.error.format().departmentCode?._errors || []
            return Response.json({
                success: false,
                message: deptCodeErrors?.length>0?deptCodeErrors.join(', '): 'Invalid query parameters',
            },{status: 400})
        }

        const {departmentCode}=result.data
        const existingVerifiedDepartment=await DepartmentModel.findOne({departmentCode})
        console.log(existingVerifiedDepartment)
        if(existingVerifiedDepartment){
            return Response.json({
                success: false,
                message: "Department Code already exists",
            },{status:400})
        }
        return Response.json({
            success:true,
            message: "Department Code available"
        },{status:200})

    } catch (error) {
        console.error("Error checking Code",error)
        return Response.json({
            success: false,
            message: "Error checking unique code"
        },{status: 500})
    }
}