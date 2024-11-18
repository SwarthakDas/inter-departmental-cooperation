import { z } from "zod";

export const deptnameValidation=z
.string()
.min(2,"Username must be 2 characters")
.max(30,"Username must be no more than 30 characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

export const SignUpSchema=z.object({
    deptname: deptnameValidation,
    email: z.string().email({message:"invalid email address"}),
    password: z.string().min(6,"password must be minimum 6 characters")
})