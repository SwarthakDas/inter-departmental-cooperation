import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import EmployeeModel from "@/model/Employee";

export async function GET(request:Request){
    await dbConnect()

    try {
        const {searchParams}=new URL(request.url)
        const queryParam={departmentName:searchParams.get('departmentName')}
        const departmentName=queryParam.departmentName?.toString()
        const department=await DepartmentModel.findOne({departmentName:departmentName})
        const departmentId=department?.toObject()._id
        if(!department){
            return Response.json({
                success: false,
                message: "Department doesnot exists"
            },{status: 500})
        }
        const employeeDetails= await EmployeeModel.find({underDepartment: departmentId})
        const employees=employeeDetails.map((emp)=>`Name:${emp.name}, Email:${emp.email}`)
        console.log(employees)
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