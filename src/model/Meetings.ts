import mongoose, {Document, Schema} from "mongoose";

export interface Meeting extends Document{
    host:string,
    guests:{
        departmentCode:string,
        employees:string[]
    }[],
    time:Date
}

export const MeetingSchema: Schema<Meeting>= new Schema({
    host:{
        type: String,
        required: [true,"Host is required"],
    },
    guests:[{
        departmentCode:{
            type:String,
            required:true,
            unique:true
        },
        employees:[{
            type:String,
        }]
    }],
    time:{
        type: Date,
        required: true
    }
})

const MeetingModel= (mongoose.models.Meeting as mongoose.Model<Meeting>) || mongoose.model<Meeting>("Meeting",MeetingSchema)

export default MeetingModel