import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function POST(request: Request){
    await dbConnect()
    try {
        const {content,count}= await request.json()
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const inventory= await DepartmentModel.findOneAndUpdate({departmentCode},{$push:{inventory:{content,count}}},{new:true,upsert:false})
        if(!inventory){
            return Response.json({
                success: false,
                message: "error registering inventory"
            },{status:500})
        }
        return Response.json({
            success: true,
            message: "Inventory updated successfully"
        },{status:201})
    } catch (error) {
        console.log("error registering inventory",error);
        return Response.json({
            success: false,
            message: "error registering inventory"
        },{status:500})
    } 
}