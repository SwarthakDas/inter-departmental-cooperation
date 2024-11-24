import mongoose, {Document, Schema} from "mongoose";


export interface Invitation extends Document{
    department: mongoose.Types.ObjectId,
    content: string,
    createdAt: Date,
}

export const InvitationSchema: Schema<Invitation>= new Schema({
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

const InvitationModel= (mongoose.models.Invitation as mongoose.Model<Invitation>) || mongoose.model<Invitation>("Employee",InvitationSchema)

export default InvitationModel