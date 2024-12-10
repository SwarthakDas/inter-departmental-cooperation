import dbConnect from "@/lib/dbConnect";
import RequestModel from "@/model/Request";
import DepartmentModel from "@/model/Department";
import EmployeeModel from "@/model/Employee";
import { ObjectId } from "mongoose";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {toDepartment,content,employeeMail,tools}=await request.json()
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const receiver=await DepartmentModel.findOne({departmentName: toDepartment})
        const sender=await DepartmentModel.findOne({departmentCode})
        const result = [...new Set(tools)].map(tool => `${tool}:${tools.filter(t => t === tool).length}`);
        
        if(!receiver || !sender){
            return Response.json({
                success: false,
                message: "Department doesnot exist"
            },{status:500})
        }
        if(employeeMail.length===0 && tools.length===0){
            return Response.json({
                success: false,
                message: "No employees or Resources found for request"
            },{status:500})
        }
        if(employeeMail.length===0){
            const newRequest=new RequestModel({
                receiver,
                sender,
                employee:null,
                tools:result,
                content,
                createdAt: Date.now(),
                status: "no"
            })
            await newRequest.save()
            await DepartmentModel.findOneAndUpdate(
                {departmentName:toDepartment},
                {$push:{pendingRequests:newRequest._id}},
                {new:true,upsert:false}
            )
            await DepartmentModel.findOneAndUpdate(
                {departmentCode},
                {$push:{givenRequests:newRequest._id}},
                {new:true,upsert:false}
            )
            return Response.json({
                success: true,
                message: "Request for Resources sent successfully"
            },{status: 201})
        }
        const employee=await EmployeeModel.findOne({email: employeeMail})
        if(!employee){
            return Response.json({
                success: false,
                message: "Employee doesnot exist"
            },{status:500})
        }
        if(employee.toObject().underDepartment.toString()!==(receiver._id as ObjectId).toString()){
            return Response.json({
                success: false,
                message: "Employee does not belong to that Department"
            },{status:500})
        }

        const newRequest=new RequestModel({
            receiver,
            sender,
            employee,
            tools:result,
            content,
            createdAt: Date.now()
        })
        await newRequest.save()
        await DepartmentModel.findOneAndUpdate(
            {departmentName:toDepartment},
            {$push:{pendingRequests:newRequest}},
            {new:true,upsert:false}
        )
        await DepartmentModel.findOneAndUpdate(
            {departmentCode},
            {$push:{givenRequests:newRequest}},
            {new:true,upsert:false}
        )
        return Response.json({
            success: true,
            message: "Request sent successfully"
        },{status: 201})

    } catch (error) {
        console.log("error sending request",error);
        return Response.json({
            success: false,
            message: "error sending request"
        },{status:500})
    }
}