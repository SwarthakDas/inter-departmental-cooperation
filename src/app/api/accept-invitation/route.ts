import dbConnect from "@/lib/dbConnect";
import InvitationModel from "@/model/Invitation";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url)
        const queryParam={inviteId:searchParams.get('inviteId')}
        const inviteId=queryParam.inviteId?.toString()
        const invite=await InvitationModel.findByIdAndUpdate(
            inviteId,
            {status:"yes"},
            {new:true,upsert:false}
        )
        if(!invite){
            return Response.json({
                success: false,
                message: "Error updating invite"
            }, { status: 500 });
        }
        return Response.json({
            success: true,
            message: "Invite accepted successfully",
        }, { status: 201 });
    } catch (error) {
        console.log("error updating invite", error);
        return Response.json({
            success: false,
            message: "Error updating invite"
        }, { status: 500 });
    }
}
