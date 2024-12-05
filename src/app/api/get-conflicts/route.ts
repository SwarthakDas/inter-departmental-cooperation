import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function GET(request: Request){
    await dbConnect()
     try {
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const department=await DepartmentModel.findOne({departmentCode:departmentCode})
        if(!department){
            return Response.json({
                success: false,
                message: "Department doesnot exists"
            },{status: 500})
        }
        const conflicts=department.toObject().conflicts.map((conflict)=>conflict.departmentName)
        return Response.json({
            success: true,
            conflicts
        },{status: 200})
     } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: 'Error getting department',
        },{status: 500})
     }
}