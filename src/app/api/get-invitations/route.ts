import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import InvitationModel from "@/model/Invitation";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const departmentId=(await DepartmentModel.findOne({departmentCode}))?.toObject()._id
        const accepted= await InvitationModel.find({receiver:departmentId,status:"no"})
        const meetings = await Promise.all(
            accepted.map(async (meeting) => {
                const host = await DepartmentModel.findById(meeting.sender).lean();
                return {
                    time: meeting.time,
                    hostName: host?.departmentName || "Unknown",
                    invitationId:meeting._id
                };
            })
        );
        return Response.json({
            success: true,
            message: "Meetings fetched successfully",
            invites:meetings
        }, { status: 201 });
    } catch (error) {
        console.log("error fetching meeting", error);
        return Response.json({
            success: false,
            message: "Error fetching meeting"
        }, { status: 500 });
    }
}
