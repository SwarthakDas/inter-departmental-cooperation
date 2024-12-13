import dbConnect from "@/lib/dbConnect";
import DiscussionModel from "@/model/Discussion";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { topic, question, author } = await request.json();

        if (!topic || !question || !author) {
            return Response.json({
                success: false,
                message: "Missing required fields: topic, question, or author",
            },{ status: 400 })
        }

        const newQuestion = new DiscussionModel({
            topic,
            question,
            author,
            createdAt: new Date(),
            replies: [],
        });

        await newQuestion.save();

        return Response.json({
            success: true,
            message: "Question registered successfully",
        },{ status: 201 })
    } catch (error) {
        console.error("Error registering question:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
        },{ status: 500 })
    }
}
