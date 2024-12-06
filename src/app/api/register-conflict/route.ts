import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {startDate,endDate}=await request.json()
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const department=await DepartmentModel.findOne({departmentCode})
        const pinCode=department?.toObject().pinCode
        const departmentName=department?.toObject().departmentName
        const sameAreaDepartments=await DepartmentModel.find({pinCode})
        const conflicts= sameAreaDepartments.filter((dept)=>{
            const deptProjects= dept.toObject().projects
            return deptProjects.some((project)=>{
                return project.startDate <= new Date(Date.parse(endDate)) && project.endDate >= new Date(Date.parse(startDate))
            })
        })
        if(conflicts.length===0){
            return Response.json({
                success: true,
                message: "No possible conflicts found to register"
            },{status:202})
        }
        const conflictIds=conflicts.map((conflict)=>conflict._id)
        const conflictNames=conflicts.map((conflict)=>conflict.departmentName)
        await DepartmentModel.updateOne(
            { departmentCode },
            { $addToSet: { conflicts:{departmentName:conflictNames[0],department:conflictIds[0]} } }
        );
        await DepartmentModel.updateMany(
            {_id:{$in:conflictIds}},
            {$addToSet:{conflicts:{departmentName:departmentName,department:department}}}
        )
        return Response.json({
            success: true,
            message: "Conflicts found and registered"
        },{status:202})
    } catch (error) {
        console.log("error searching conflict",error);
        return Response.json({
            success: false,
            message: "error searching conflict"
        },{status:500})
    }
}