import mongoose, {Document, Schema} from "mongoose";

export interface Request extends Document{
    receiver: mongoose.Types.ObjectId,
    sender: mongoose.Types.ObjectId,
    employee: mongoose.Types.ObjectId[],
    tools: string[],
    content: string,
    createdAt: Date,
    status: string
}

export const RequestSchema: Schema<Request>= new Schema({
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
    employee:[{
        type: Schema.Types.ObjectId,
        ref: "EmployeeModel", 
    }],
    tools:[{
        type: String
    }],
    content:{
        type: String
    },
    createdAt:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        default: ""
    }
})

const RequestModel= (mongoose.models.Request as mongoose.Model<Request>) || mongoose.model<Request>("Request",RequestSchema)

export default RequestModel