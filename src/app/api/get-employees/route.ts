import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {departmentCode}=await request.json()
        const department=await DepartmentModel.findOne({departmentCode})
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