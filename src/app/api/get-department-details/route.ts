import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function GET(request: Request){
    await dbConnect()
     try {
        const {searchParams}=new URL(request.url)
        const queryParam={departmentId:searchParams.get('departmentId')}
        const departmentId=queryParam.departmentId?.toString()
        const department=await DepartmentModel.findOne({_id:departmentId})

        return Response.json({
            success:true,
            message: "Employee details found",
            departmentName: department?.departmentName,
            departmentCode: department?.departmentCode,
            departmentEmail: department?.officialEmail,
            departmentInfo: department?.info,
            departmentContact: department?.contact,
            departmentAddress: department?.address
        },{status:200})
     } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: 'Error getting department',
        },{status: 500})
     }
}