import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import InvitationModel from "@/model/Invitation";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {toDepartment,fromDepartment,time}=await request.json()
        const receiver=await DepartmentModel.findOne({departmentName: toDepartment})
        const sender=await DepartmentModel.findOne({departmentName: fromDepartment})
        if(!receiver || !sender){
            return Response.json({
                success: false,
                message: "Department doesnot exist"
            },{status:500})
        }
        const newInvitation=new InvitationModel({
            receiver,
            sender,
            time: new Date(time),
            status: "no"
        })
        await newInvitation.save()
        await DepartmentModel.findOneAndUpdate(
            {departmentName:toDepartment},
            {$push:{pendingInvites:newInvitation}},
            {new:true,upsert:false}
        )
        await DepartmentModel.findOneAndUpdate(
            {departmentName:fromDepartment},
            {$push:{givenInvites:newInvitation}},
            {new:true,upsert:false}
        )
        return Response.json({
            success: true,
            message: "Invitation sent successfully"
        },{status: 201})

    } catch (error) {
        console.log("error sending invitation",error)
        return Response.json({
            success: false,
            message: "error sending invitation"
        },{status:500})
    }
}