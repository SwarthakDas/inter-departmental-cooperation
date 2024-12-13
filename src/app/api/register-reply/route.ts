import dbConnect from "@/lib/dbConnect";
import DiscussionModel from "@/model/Discussion";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { questionId, content, author } = await request.json();

        if (!questionId || !content || !author) {
            return Response.json({
                success: false,
                message: "Missing required fields: questionId, content, or author",
            }, { status: 400 });
        }

        const question = await DiscussionModel.findById(questionId);

        if (!question) {
            return Response.json({
                success: false,
                message: "Question not found",
            }, { status: 404 });
        }

        const newReply = {
            id: question.replies.length + 1,
            author,
            content,
            createdAt: new Date(),
        };

        question.replies.push(newReply);
        await question.save();

        return Response.json({
            success: true,
            message: "Reply registered successfully",
        }, { status: 201 });
    } catch (error) {
        console.error("Error registering reply:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500 });
    }
}
