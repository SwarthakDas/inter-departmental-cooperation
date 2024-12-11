import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import EmployeeModel from "@/model/Employee";
import RequestModel from "@/model/Request";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const departmentId=(await DepartmentModel.findOne({departmentCode}))?.toObject()._id
        const requests=await RequestModel.find({receiver:departmentId})
        const results = await Promise.all(
            requests.map(async (request) => {
                const sender = await DepartmentModel.findById(request.sender).lean();
                
                const employeesRequested=await Promise.all(request.employee.map(async(emp)=>{
                    const employee=await EmployeeModel.findById(emp)
                    return `employeeName:${employee?.name},email:${employee?.email}`
                }))
                const inventoryRequested=await Promise.all(request.tools.map(async(inv)=>{
                    const [name, quantity] = inv.split(":");
                    return{
                        name,
                        quantity
                    }
                }))
                return {
                    senderName:sender?.departmentName,
                    employeesRequested,
                    inventoryRequested,
                    senderMessage:request.content,
                    creationTime:request.createdAt.toString(),
                    status:request.status,
                    requestId:request._id
                };
            })
        );
        return Response.json({
            success: true,
            message: "Meetings fetched successfully",
            requests:results
        }, { status: 201 });
    } catch (error) {
        console.log("error fetching meeting", error);
        return Response.json({
            success: false,
            message: "Error fetching meeting"
        }, { status: 500 });
    }
}
