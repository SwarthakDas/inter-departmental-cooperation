import mongoose, {Document, Schema} from "mongoose";

export interface Request extends Document{
    id: number,
    department: mongoose.Types.ObjectId,
    employee: mongoose.Types.ObjectId[],
    tools: string[],
    content: string,
    createdAt: Date,
}

export const RequestSchema: Schema<Request>= new Schema({
    id:{
        type: Number,
        required: [true, "request id is required"],
        unique: true
    },
    department:{
        type: Schema.Types.ObjectId,
        ref: "DepartmentModel",
        required: [true,"department is required"],
    },
    employee:[{
        type: Schema.Types.ObjectId,
        ref: "EmployeeModel", 
    }],
    tools: [{
        type: String
    }],
    content:{
        type: String
    },
    createdAt:{
        type: Date,
        required: true
    }
})
