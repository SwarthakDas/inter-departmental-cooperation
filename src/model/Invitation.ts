import mongoose, {Document, Schema} from "mongoose";


export interface Invitation extends Document{
    receiver: mongoose.Types.ObjectId,
    sender: mongoose.Types.ObjectId,
    time: Date,
    status:string
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
    time:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        default: "no"
    }
})

const InvitationModel= (mongoose.models.Invitation as mongoose.Model<Invitation>) || mongoose.model<Invitation>("Invitation",InvitationSchema)

export default InvitationModel