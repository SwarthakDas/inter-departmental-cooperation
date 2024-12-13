import mongoose, { Document, Schema } from "mongoose";

export interface Discussion extends Document {
  topic: string;
  question: string;
  author: string;
  createdAt: Date;
  replies: {
    author: string;
    content: string;
    createdAt: Date;
  }[];
}

const DiscussionSchema: Schema<Discussion> = new Schema({
  topic: {
    type: String,
    required: [true, "Topic is required"],
  },
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  replies: {
    type: [
      {
        author: {
          type: String,
          required: [true, "Author is required"],
        },
        content: {
          type: String,
          required: [true, "Content is required"],
        },
        createdAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
});

const DiscussionModel =(mongoose.models.Discussion as mongoose.Model<Discussion>) || mongoose.model<Discussion>("Discussion", DiscussionSchema);

export default DiscussionModel;
