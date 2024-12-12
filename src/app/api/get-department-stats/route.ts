import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import MeetingModel from "@/model/Meetings";

export async function GET(request: Request){
    await dbConnect()
     try {
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const department=await DepartmentModel.findOne({departmentCode:departmentCode})
        const meetings=await MeetingModel.find({host:departmentCode})
        const departmentStats={
            "Projects": department?.toObject().projects.length,
            "Employees": department?.toObject().employees.length,
            "Resources Shared":(department?.toObject().employeesUnavailable.length || 0)+(department?.toObject().inventoryUnavailable.length || 0),
            "Meetings Held":meetings.length,
            "Member Since": department?.toObject().createdAt.toDateString().split(' ').slice(1).join(' '),
            "Requests Made":department?.toObject().givenRequests.length,
            "Invites Sent":department?.toObject().givenInvites.length,
            "Requests Received":department?.toObject().pendingRequests.length,
            "Invites Received":department?.toObject().pendingInvites.length
        }
        return Response.json({
            success:true,
            message: "Employee details found",
            departmentStats
        },{status:200})
     } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: 'Error getting department',
        },{status: 500})
     }
}