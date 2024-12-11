import dbConnect from "@/lib/dbConnect";
import RequestModel from "@/model/Request";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url)
        const queryParam={requestId:searchParams.get('requestId')}
        const requestId=queryParam.requestId?.toString()
        const deptRequest=await RequestModel.findByIdAndUpdate(
            requestId,
            {status:"accepted"},
            {new:true,upsert:false}
        )
        if(!deptRequest){
            return Response.json({
                success: false,
                message: "Error updating request"
            }, { status: 500 });
        }
        return Response.json({
            success: true,
            message: "request accepted successfully",
        }, { status: 201 });
    } catch (error) {
        console.log("error updating request", error);
        return Response.json({
            success: false,
            message: "Error updating request"
        }, { status: 500 });
    }
}
