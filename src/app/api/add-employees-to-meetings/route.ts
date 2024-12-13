import dbConnect from "@/lib/dbConnect";
import MeetingModel from "@/model/Meetings";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { employees } = await request.json();
        const { searchParams } = new URL(request.url);
        const departmentName = searchParams.get('departmentName');

        const meetings = await MeetingModel.find({
            "guests.departmentName": departmentName
        });

        if (!meetings.length) {
            return Response.json({
                success: false,
                message: "No meetings found for the specified department."
            }, { status: 404 });
        }
        for (const meeting of meetings) {
            meeting.guests = meeting.guests.map(guest => {
                if (guest.departmentName === departmentName) {
                    const updatedEmployees = [...new Set([...guest.employees, ...employees])];
                    return {
                        ...guest,
                        employees: updatedEmployees
                    };
                }
                return guest;
            });

            await meeting.save();
        }

        return Response.json({
            success: true,
            message: "Employees updated successfully for the specified department."
        }, { status: 200 });
    } catch (error) {
        console.log("Error updating employees", error);
        return Response.json({
            success: false,
            message: "Error updating employees"
        }, { status: 500 });
    }
}
