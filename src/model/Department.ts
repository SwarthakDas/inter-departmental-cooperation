import mongoose,{Document, Schema} from "mongoose";
import EmployeeModel, { Employee } from "./Employee";
import { Request, RequestSchema } from "./Request";
import { Invitation, InvitationSchema } from "./Invitation";


export interface PendingInvitation extends Document{
    invitationRequestFrom: Invitation
}

const PendingInvitationSchema: Schema<PendingInvitation> = new Schema({
    invitationRequestFrom: InvitationSchema,
})

export interface Conflict extends Document{
    department: string[],
    count: number,
    notification: boolean
}

const ConflictSchema: Schema<Conflict>= new Schema({
    department:[{
        type: String,
        required: [true,"department name is required"]
    }],
    count: {
        type: Number,
        default: 0
    },
    notification:{
        type: Boolean,
        default: false
    }
})


export interface Tools extends Document{
    content: string,
    count: number
}

const ToolsSchema: Schema<Tools>= new Schema({
    content:{
        type: String,
        required: [true,"Tools content is required"]
    },
    count:{
        type: Number,
        default: 0
    }
})

export interface PendingRequest extends Document{
    requests: Request[],
    notification: boolean
}

const PendingRequestSchema: Schema<PendingRequest>= new Schema({
    requests: [RequestSchema],
    notification:{
        type: Boolean,
        default: false
    }
})

export interface OngoingProject extends Document{
    startDate: Date,
    endDate: Date,
}

const OngoingProjectSchema: Schema<OngoingProject>= new Schema({
    startDate:{
        type: Date
    },
    endDate:{
        type: Date
    }
})


export interface Department extends Document{
    username: string,
    email:string,
    password: string,
    info: string,
    employees: Employee[],
    invites: PendingInvitation[],
    conflicts: Conflict[],
    projects: OngoingProject[],
    pendingRequest: PendingRequest[],
    tools: Tools[]
}

const DepartmentSchema: Schema<Department>= new Schema({
    username:{
        type: String,
        required: [true,"Username is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true,"email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true,"password is required"],
    },
    info:{
        type: String,
    },
    employees: [EmployeeModel],
    invites: [PendingInvitationSchema],
    conflicts: [ConflictSchema],
    projects: [OngoingProjectSchema],
    pendingRequest: [PendingRequestSchema],
    tools: [ToolsSchema],
})


const DepartmentModel= (mongoose.models.Department as mongoose.Model<Department>) || mongoose.model<Department>("Department",DepartmentSchema)

export default DepartmentModel