import { z } from "zod";

export const SignInSchema=z.object({
    officialEmail: z.string().email({message:"invalid email address"}),
    password: z.string().min(6,"password must be minimum 6 characters"),
})