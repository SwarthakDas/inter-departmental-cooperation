import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {startDate,endDate,departmentCode}=await request.json()
        const department=await DepartmentModel.findOne({departmentCode})
        const pinCode=department?.toObject().pinCode
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
        //FIXME:
        await DepartmentModel.updateOne(
            { departmentCode },
            { $addToSet: { conflicts: {department:conflictIds} } }
        );
        await DepartmentModel.updateMany(
            {_id:{$in:conflictIds}},
            {$addToSet:{conflicts:{department:department}}}
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