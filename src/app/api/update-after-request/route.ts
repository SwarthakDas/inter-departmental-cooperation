import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";
import EmployeeModel from "@/model/Employee";
import RequestModel from "@/model/Request";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url)
        const queryParam={requestId:searchParams.get('requestId')}
        const requestId=queryParam.requestId?.toString()
        const deptRequest=await RequestModel.findByIdAndUpdate(
            requestId,
            {status:"updated"},
            {new:true,upsert:false}
        )
        const employees=deptRequest?.employee
        if(!employees)throw new Error("No employee found")
        for(const emp of employees){
            const employee=await EmployeeModel.findById(emp)
            const result={name:employee?.name,employeeDetails:employee?._id}
            await DepartmentModel.findByIdAndUpdate(
                deptRequest?.receiver,
                {
                    $addToSet: {
                        employeesUnavailable: result
                    }
                },
                { new: true }
            );
        }
        const tools=deptRequest?.tools
        if(!tools)throw new Error("No inventory found")
            for (const tool of tools) {
                const [content, count] = tool.split(":");
                const decrementCount = parseInt(count.trim(), 10);
                await DepartmentModel.findByIdAndUpdate(
                    deptRequest?.receiver,
                    {
                        $addToSet: {
                            inventoryUnavailable: {
                                content: content.trim(),
                                count: decrementCount,
                            }
                        }
                    },
                    { new: true}
                );
            }
        if(!deptRequest){
            return Response.json({
                success: false,
                message: "Error updating request"
            }, { status: 500 });
        }
        return Response.json({
            success: true,
            message: "updated successfully",
        }, { status: 201 });
    } catch (error) {
        console.log("error updating request", error);
        return Response.json({
            success: false,
            message: "Error updating request"
        }, { status: 500 });
    }
}
