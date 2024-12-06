import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function GET(){
    await dbConnect()

    try{
        const departments=await DepartmentModel.find()
        const depts=departments.map((dept)=>dept.toObject().departmentName)
        return Response.json({
            success: true,
            departmentNames: depts
        },{status: 200})
    } catch (error) {
        console.log("Error getting departments",error);
        return Response.json({
            success: false,
            message: "Error getting departments"
        },{status: 500})
    }
}