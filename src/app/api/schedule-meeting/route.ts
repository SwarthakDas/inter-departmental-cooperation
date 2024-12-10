import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import MeetingModel from "@/model/Meetings";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { time, guests } = await request.json();
        const {searchParams}=new URL(request.url)
        const queryParam={departmentName:searchParams.get('departmentName')}
        const departmentName=queryParam.departmentName?.toString()
        const department = await DepartmentModel.findOne({ departmentName });

        if (!department) {
            return Response.json({
                success: false,
                message: "Department not found"
            }, { status: 404 });
        }
        const departmentCode=department.toObject().departmentCode
        const guestDepartments = await Promise.all(
            guests.map(async (guest: string) => {
              const guestDepartment = await DepartmentModel.findOne({ departmentName: guest });
              if (!guestDepartment) {
                throw new Error(`Guest department ${guest} not found`);
              }
              return {
                departmentCode: guestDepartment.toObject().departmentCode,
                departmentName: guestDepartment.toObject().departmentName,
                employees: [],
              };
            })
          )
        const newMeeting= new MeetingModel({
            host:departmentCode,
            guests:guestDepartments,
            time
        })
        await newMeeting.save()

        return Response.json({
            success: true,
            message: "Meeting scheduled successfully"
        }, { status: 201 });
    } catch (error) {
        console.log("error scheduling meeting", error);
        return Response.json({
            success: false,
            message: "Error scheduling meeting"
        }, { status: 500 });
    }
}
