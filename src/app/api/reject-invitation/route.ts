import dbConnect from "@/lib/dbConnect";
import InvitationModel from "@/model/Invitation";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url)
        const queryParam={inviteId:searchParams.get('inviteId')}
        const inviteId=queryParam.inviteId?.toString()
        const deletedInvite = await InvitationModel.findByIdAndDelete(inviteId);
        if(!deletedInvite){
            return Response.json({
                success: false,
                message: "Invite not found or already deleted"
            }, { status: 500 });
        }
        return Response.json({
            success: true,
            message: "Invite rejected successfully",
        }, { status: 201 });
    } catch (error) {
        console.log("error rejecting invite", error);
        return Response.json({
            success: false,
            message: "Error rejecting invite"
        }, { status: 500 });
    }
}
