import { z } from "zod";

export const deptnameValidation=z
.string()
.min(3,"Unique Code must be 3 characters")
.max(20,"Unique Code must be no more than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"unique code must not contain special character")

export const SignUpSchema=z.object({
    departmentName: z.string(),
    departmentCode: deptnameValidation,
    officialEmail: z.string().email({message:"invalid email address"}),
    password: z.string().min(6,"password must be minimum 6 characters"),
    info: z.string(),
    address: z.string(),
    contact: z.string().regex(/^\d+$/, "Contact must be a valid number").transform((val) => Number(val)),
    pinCode: z.string().regex(/^\d+$/, "Contact must be a valid number").transform((val) => Number(val))
})