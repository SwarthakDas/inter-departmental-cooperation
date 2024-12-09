import dbConnect from "@/lib/dbConnect";
import DepartmentModel from "@/model/Department";

function joinMessages(receivedMessages, sentMessages) {
    const result = [] as Array<object>;

    const addMessagesWithType = (messages, messageType) => {
        return messages.map(msg => ({
            ...msg,
            messageType: messageType
        }));
    };

    const receivedMessagesMap = receivedMessages.reduce((acc, department) => {
        acc[department.departmentCode] = department.messages;
        return acc;
    }, {});

    const sentMessagesMap = sentMessages.reduce((acc, department) => {
        acc[department.departmentCode] = department.messages;
        return acc;
    }, {});

    const allDepartmentCodes = new Set([
        ...Object.keys(receivedMessagesMap),
        ...Object.keys(sentMessagesMap)
    ]);

    allDepartmentCodes.forEach(departmentCode => {
        const received = receivedMessagesMap[departmentCode] || [];
        const sent = sentMessagesMap[departmentCode] || [];

        const mergedMessages = [
            ...addMessagesWithType(received, 'received'),
            ...addMessagesWithType(sent, 'sent')
        ];

        mergedMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        result.push({
            departmentCode,
            messages: mergedMessages as Array<string>
        });
    });

    return result;
}


export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = { departmentCode: searchParams.get('departmentCode') };
        const departmentCode = queryParam.departmentCode?.toString();
        const department = await DepartmentModel.findOne({ departmentCode: departmentCode });

        if (!department) {
            return Response.json({
                success: false,
                message: "Department does not exist"
            }, { status: 500 });
        }

        const receivedMessages = department.toObject().receivedMessages.map(dept => ({
            departmentCode: dept.fromDepartmentCode,
            messages: dept.messages
        }));

        const sentMessages = department.toObject().sentMessages.map(dept => ({
            departmentCode: dept.toDepartmentCode,
            messages: dept.messages
        }));

        const mergedMessages = joinMessages(receivedMessages, sentMessages);

        return Response.json({
            success: true,
            receivedMessages: mergedMessages
        }, { status: 200 });

    } catch (error) {
        console.log("Error getting messages", error);
        return Response.json({
            success: false,
            message: "Error getting messages"
        }, { status: 500 });
    }
}
