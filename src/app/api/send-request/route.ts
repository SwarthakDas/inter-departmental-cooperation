import dbConnect from "@/lib/dbConnect";
import RequestModel from "@/model/Request";
import DepartmentModel from "@/model/Department";
import EmployeeModel from "@/model/Employee";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {toDepartment,fromDepartment,content,employeeMail,tools}=await request.json()
        const receiver=await DepartmentModel.findOne({toDepartment})
        const sender=await DepartmentModel.findOne({fromDepartment})
        const employee=await EmployeeModel.findOne({employeeMail})
        
        if(!receiver || !sender){
            return Response.json({
                success: false,
                message: "Department doesnot exist"
            },{status:500})
        }
        if(employeeMail===""){
            //TODO:
        }
        if(!employee){
            return Response.json({
                success: false,
                message: "Employee doesnot exist"
            },{status:500})
        }
        
        if(employee.underDepartment!==receiver._id){
            return Response.json({
                success: false,
                message: "Employee doesnot belong to that Department"
            },{status:500})
        }

        const newRequest=new RequestModel({
            receiver,
            sender,
            employee,
            tools,
            content,
            createdAt: Date.now()
        })
        await newRequest.save()
        return Response.json({
            success: true,
            message: "Invitation sent successfully"
        },{status: 201})

    } catch (error) {
        console.log("error sending request",error);
        return Response.json({
            success: false,
            message: "error sending request"
        },{status:500})
    }
}