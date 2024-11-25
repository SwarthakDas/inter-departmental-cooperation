import mongoose,{Document, Schema} from "mongoose";

export interface DepartmentInvite extends Document{
    invites: mongoose.Types.ObjectId[]
}

const DepartmentInviteSchema: Schema<DepartmentInvite> = new Schema({
    invites:[{
        type:Schema.Types.ObjectId,
        ref:"InvitationModel"
    }]
})

export interface DepartmentRequest extends Document{
    requests: mongoose.Types.ObjectId[],
}

const DepartmentRequestSchema: Schema<DepartmentRequest>= new Schema({
    requests: [{
        type: Schema.Types.ObjectId,
        ref: "RequestModel"
    }],
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


export interface Inventory extends Document{
    content: string,
    count: number
}

const InventorySchema: Schema<Inventory>= new Schema({
    content:{
        type: String,
        required: [true,"Tools content is required"]
    },
    count:{
        type: Number,
        default: 0
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
    departmentName: string,
    departmentCode: string,
    officialEmail:string,
    password: string,
    info: string,
    employees: mongoose.Types.ObjectId[],
    conflicts: Conflict[],
    projects: OngoingProject[],
    pendingInvites: DepartmentInvite[],
    pendingRequests: DepartmentRequest[],
    givenInvites: DepartmentInvite[],
    givenRequests: DepartmentRequest[],
    inventory: Inventory[],
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
    contact: number,
    address: string,
    pinCode: number
}

const DepartmentSchema: Schema<Department>= new Schema({
    departmentName:{
        type: String,
        required: [true,"Department name is required"],
    },
    departmentCode:{
        type: String,
        required: [true, "Unique code is required"],
        trim: true,
        unique: true
    },
    officialEmail:{
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
        default: ""
    },
    employees: [{
        type: Schema.Types.ObjectId,
        ref: "EmployeeModel"
    }],
    conflicts: {
        type: [ConflictSchema],
        default: [],
    },
    projects: {
        type: [OngoingProjectSchema],
        default: [],
    },
    pendingInvites:{
        type: [DepartmentInviteSchema],
        default:[]
    },
    pendingRequests: {
        type: [DepartmentRequestSchema],
        default: [],
    },
    givenInvites:{
        type: [DepartmentInviteSchema],
        default: [],
    },
    givenRequests:{
        type: [DepartmentRequestSchema],
        default: [],
    },
    inventory: {
        type: [InventorySchema],
        default: [],
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    },
    contact:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    pinCode:{
        type: Number,
        required: true
    }
})


const DepartmentModel= (mongoose.models.Department as mongoose.Model<Department>) || mongoose.model<Department>("Department",DepartmentSchema)

export default DepartmentModel