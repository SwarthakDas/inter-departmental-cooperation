import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { message, toDepartmentCode } = await request.json();
        const {searchParams}=new URL(request.url)
        const queryParam={departmentCode:searchParams.get('departmentCode')}
        const departmentCode=queryParam.departmentCode?.toString()
        const department = await DepartmentModel.findOne({ departmentCode });

        if (!department) {
            return Response.json({
                success: false,
                message: "Department not found"
            }, { status: 404 });
        }
        const existingSentMessage = department.sentMessages.find(
            (sentMessage: any) => sentMessage.toDepartmentCode === toDepartmentCode
        )
        if (existingSentMessage) {
            await DepartmentModel.findOneAndUpdate(
                {
                    departmentCode,
                    "sentMessages.toDepartmentCode": toDepartmentCode
                },
                {
                    $push: {
                        "sentMessages.$.messages": { message, createdAt: new Date() } 
                    }
                },
                {new: true,upsert: false}
            );
        } else {
            const newSentMessage = {
                toDepartmentCode,
                messages: [{ message, createdAt: new Date() }]
            };
            await DepartmentModel.findOneAndUpdate(
                {departmentCode},
                {$push:{sentMessages:newSentMessage}},
                {new:true,upsert:false}
            )
        }

        const recipientDepartment = await DepartmentModel.findOne({ departmentCode: toDepartmentCode });

        if (!recipientDepartment) {
            throw new Error("Recipient department not found");
        }

        const existingReceivedMessage = recipientDepartment.receivedMessages.find(
            (receivedMessage: any) => receivedMessage.fromDepartmentCode === departmentCode
        );
        if (existingReceivedMessage) {
            await DepartmentModel.findOneAndUpdate(
                {
                    departmentCode: toDepartmentCode,
                    "receivedMessages.fromDepartmentCode": departmentCode
                },
                {
                    $push: {
                        "receivedMessages.$.messages": { message, createdAt: new Date() }
                    }
                },
                { new: true, upsert: false }
            );
        } else {
            const newReceivedMessage = {
                fromDepartmentCode:departmentCode,
                messages: [{ message, createdAt: new Date() }]
            };
            await DepartmentModel.findOneAndUpdate(
                { departmentCode: toDepartmentCode },
                { $push: { receivedMessages: newReceivedMessage } },
                { new: true, upsert: false }
            );
        }


        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 201 });
    } catch (error) {
        console.log("error sending message", error);
        return Response.json({
            success: false,
            message: "Error sending message"
        }, { status: 500 });
    }
}
