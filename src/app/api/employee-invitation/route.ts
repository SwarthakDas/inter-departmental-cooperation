import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import EmployeeModel from "@/model/Employee";
import MeetingModel from "@/model/Meetings";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url)
        const queryParam={employeeId:searchParams.get('employeeId')}
        const employeeId=queryParam.employeeId?.toString()
        const employee=await EmployeeModel.findById(employeeId)
        const email=employee?.email

        if (!email) {
            return Response.json({
                success: false,
                message: "Email is required",
            }, { status: 400 });
        }
        const meetings = await MeetingModel.find({
            "guests.employees": email
        });
        const formattedMeetings = await Promise.all(
            meetings.map(async (meeting) => {
                const hostDepartment = await DepartmentModel.findOne({ departmentCode: meeting.host }).lean();
                return {
                    time: meeting.time,
                    hostId: hostDepartment?._id || "Unknown",
                    hostName: hostDepartment?.departmentName || "Unknown",
                };
            })
        );

        return Response.json({
            success: true,
            message: "Meetings fetched successfully",
            meetings: formattedMeetings,
        }, { status: 200 });

    } catch (error) {
        console.log("Error fetching meetings", error);
        return Response.json({
            success: false,
            message: "Error fetching meetings",
        }, { status: 500 });
    }
}
