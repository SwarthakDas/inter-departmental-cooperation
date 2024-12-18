import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function GET(request:Request){
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
        const employees=department.toObject().employees.map((employee)=>employee.name)
        return Response.json({
            success: true,
            employees
        },{status: 200})
    } catch (error) {
        console.log("Error getting employees",error);
        return Response.json({
            success: false,
            message: "error registering employee"
        },{status: 500})
    }
}