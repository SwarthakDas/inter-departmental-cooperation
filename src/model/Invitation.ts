import mongoose, {Document, Schema} from "mongoose";


export interface Invitation extends Document{
    id: number,
    department: mongoose.Types.ObjectId,
    content: string,
    createdAt: Date,
}

export const InvitationSchema: Schema<Invitation>= new Schema({
    id:{
        type: Number,
        required: [true, "request id is required"],
        unique: true
    },
    department:[{
        type: Schema.Types.ObjectId,
        ref: "DepartmentModel",
        required: [true, "Department is required"],
    }],
    content:{
        type: String
    },
    createdAt:{
        type: Date,
        required: true
    }
})
