import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import EmployeeModel from "@/model/Employee";

export async function GET(request: Request){
    await dbConnect()

    try {
        const {searchParams}=new URL(request.url)
        const queryParam={
            employeeId: searchParams.get('employeeId')
        }
        const employeeId=queryParam.employeeId?.toString()
        const employee= await EmployeeModel.findOne({_id: employeeId})
        const deptId=employee?.underDepartment.toString()
        const underDepartment= await DepartmentModel.findOne({_id: deptId})

        return Response.json({
            success:true,
            message: "Employee details found",
            employeeName: employee?.name,
            underDepartment: underDepartment?.departmentName
        },{status:200})
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: 'Error getting employee',
        },{status: 500})
    }
}