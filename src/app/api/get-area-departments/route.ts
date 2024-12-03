import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function GET(request:Request){
    await dbConnect()

    try {
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const department=await DepartmentModel.findOne({departmentCode:departmentCode})
        const pinCode=department?.toObject().pinCode
        const sameAreaDepartments=await (await DepartmentModel.find({pinCode})).map((dept)=>dept.departmentName)
        if(sameAreaDepartments.length===0){
            return Response.json({
                success: true,
                message: "No Departments found in this area"
            },{status:202})
        }
        return Response.json({
            success: true,
            message: "Departments found",
            sameAreaDepartments
        },{status:202})
    } catch (error) {
        console.log("error searching departments in area",error);
        return Response.json({
            success: false,
            message: "error searching departments in area"
        },{status:500})
    }
}