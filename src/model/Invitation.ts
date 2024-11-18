import {Document, Schema} from "mongoose";
import DepartmentModel, { Department} from "./Department";

export interface Invitation extends Document{
    id: number,
    department: Department[],
    content: string,
    createdAt: Date,
}

export const InvitationSchema: Schema<Invitation>= new Schema({
    id:{
        type: Number,
        required: [true, "request id is required"],
        unique: true
    },
    department:[DepartmentModel],
    content:{
        type: String
    },
    createdAt:{
        type: Date,
        required: true
    }
})
