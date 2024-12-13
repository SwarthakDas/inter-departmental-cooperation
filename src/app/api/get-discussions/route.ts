import dbConnect from "@/lib/dbConnect";
import DiscussionModel from "@/model/Discussion";

export async function GET() {
    await dbConnect();
    try {
        const discussions = await DiscussionModel.find({}, {
            _id: 1,
            topic: 1,
            question: 1,
            author: 1,
            createdAt: 1,
            replies: { $slice: 3 }
        }).sort({ createdAt: -1 });

        return Response.json({
            success: true,
            discussions
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching discussions:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500 });
    }
}
