import { z } from "zod";

export const deptnameValidation=z
.string()
.min(3,"Unique Code must be 3 characters")
.max(20,"Unique Code must be no more than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"unique code must not contain special character")

export const SignUpSchema=z.object({
    departmentCode: deptnameValidation,
    officialEmail: z.string().email({message:"invalid email address"}),
    password: z.string().min(6,"password must be minimum 6 characters")
})