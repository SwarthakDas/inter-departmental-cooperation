import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {description,startDate,endDate,departmentCode}=await request.json()
        const project=await DepartmentModel.findOneAndUpdate({departmentCode},{$push:{projects:{description,startDate:new Date(Date.parse(startDate)),endDate:new Date(Date.parse(endDate))}}},{new:true,upsert:false})
        if(!project){
            return Response.json({
                success: false,
                message: "error registering project"
            },{status:500})
        }
        return Response.json({
            success: true,
            message: "Project registered successfully"
        },{status: 201})
    } catch (error) {
        console.log("error sending request",error);
        return Response.json({
            success: false,
            message: "error sending request"
        },{status:500})
    }
}