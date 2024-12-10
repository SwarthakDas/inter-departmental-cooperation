import dbConnect from "@/lib/dbConnect";
import MeetingModel from "@/model/Meetings";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const meetings = await MeetingModel.find({ host:departmentCode });
        if (!meetings) {
            return Response.json({
                success: false,
                message: "No meetings found"
            }, { status: 404 });
        }
        const guests=meetings.map(guest=>({
            time:guest.toObject().time,
            guests:guest.toObject().guests
        }))
        return Response.json({
            success: true,
            message: "Meetings fetched successfully",
            meetings:guests
        }, { status: 201 });
    } catch (error) {
        console.log("error fetching meeting", error);
        return Response.json({
            success: false,
            message: "Error fetching meeting"
        }, { status: 500 });
    }
}
