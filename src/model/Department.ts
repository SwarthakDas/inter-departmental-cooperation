import mongoose,{Document, Schema} from "mongoose";

export interface DepartmentEmployee extends Document{
    name: string,
    employeeDetails: mongoose.Types.ObjectId
}

const DepartmentEmployeeSchema: Schema<DepartmentEmployee>=new Schema({
    name:{
        type:String,
        required:true
    },
    employeeDetails:{
        type:Schema.Types.ObjectId,
        ref:"EmployeeModel"
    }
})

export interface Conflict extends Document{
    title: string,
    description: string,
    departmentName: string,
    department: mongoose.Types.ObjectId
}

const ConflictSchema: Schema<Conflict>= new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    departmentName:{
        type: String,
        required: true
    },
    department:{
        type: Schema.Types.ObjectId,
        ref: "DepartmentModel"
    },
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

export interface SentMessages extends Document{
    messages: {
        message: string;
        createdAt: Date;
    }[],
    toDepartmentCode: string,
}

const SentMessagesSchema: Schema<SentMessages>=new Schema({
    messages: [
        {
            message: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    toDepartmentCode:{
        type:String
    }
})
export interface ReceivedMessages extends Document{
    messages: {
        message: string;
        createdAt: Date;
    }[],
    fromDepartmentCode: string,
}

const ReceivedMessagesSchema: Schema<ReceivedMessages>=new Schema({
    messages: [
        {
            message: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    fromDepartmentCode:{
        type:String
    }
})


export interface OngoingProject extends Document{
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
}

const OngoingProjectSchema: Schema<OngoingProject>= new Schema({
    title:{
        type:String
    },
    description:{
        type: String
    },
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
    employees: DepartmentEmployee[],
    conflicts: Conflict[],
    projects: OngoingProject[],
    pendingInvites: mongoose.Types.ObjectId[],
    pendingRequests: mongoose.Types.ObjectId[],
    givenInvites: mongoose.Types.ObjectId[],
    givenRequests: mongoose.Types.ObjectId[],
    inventory: Inventory[],
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
    contact: number,
    address: string,
    pinCode: number,
    sentMessages: SentMessages[],
    receivedMessages: ReceivedMessages[],
    employeesUnavailable: DepartmentEmployee[],
    inventoryUnavailable: Inventory[] 
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
    employees: {
        type: [DepartmentEmployeeSchema],
        default:[]
    },
    conflicts: {
        type: [ConflictSchema],
        default: [],
    },
    projects: {
        type: [OngoingProjectSchema],
        default: [],
    },
    pendingInvites:[{
        type: Schema.Types.ObjectId,
        ref: "InvitationModel"
    }],
    pendingRequests: [{
        type: Schema.Types.ObjectId,
        ref: "RequestModel"
    }],
    givenInvites:[{
        type: Schema.Types.ObjectId,
        ref: "InvitationModel"
    }],
    givenRequests:[{
        type: Schema.Types.ObjectId,
        ref: "RequestModel"
    }],
    inventory: {
        type: [InventorySchema],
        default: [],
    },
    isVerified:{
        type: Boolean,
        default: true
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
    },
    sentMessages:{
        type:[SentMessagesSchema],
        default: []
    },
    receivedMessages:{
        type:[ReceivedMessagesSchema],
        default: []
    },
    employeesUnavailable: {
        type: [DepartmentEmployeeSchema],
        default:[]
    },
    inventoryUnavailable: {
        type: [InventorySchema],
        default: [],
    },
})


const DepartmentModel= (mongoose.models.Department as mongoose.Model<Department>) || mongoose.model<Department>("Department",DepartmentSchema)

export default DepartmentModel