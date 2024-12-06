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
        const inventory = department.toObject().inventory.map((inv) => ({
            name: inv.content,
            count: inv.count
        }));
        return Response.json({
            success: true,
            inventory
        },{status: 200})
    } catch (error) {
        console.log("Error getting inventory",error);
        return Response.json({
            success: false,
            message: "Error getting inventory"
        },{status: 500})
    }
}