import mongoose, {Document, Schema} from "mongoose";


export interface Invitation extends Document{
    receiver: mongoose.Types.ObjectId,
    sender: mongoose.Types.ObjectId,
    content: string,
    createdAt: Date,
}

export const InvitationSchema: Schema<Invitation>= new Schema({
    receiver:{
        type: Schema.Types.ObjectId,
        ref: "DepartmentModel",
        required: [true,"department is required"],
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref: "DepartmentModel",
        required: [true,"department is required"],
    },
    content:{
        type: String
    },
    createdAt:{
        type: Date,
        required: true
    }
})

const InvitationModel= (mongoose.models.Invitation as mongoose.Model<Invitation>) || mongoose.model<Invitation>("Invitation",InvitationSchema)

export default InvitationModel