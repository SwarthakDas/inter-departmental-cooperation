import bcrypt from 'bcryptjs';
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from '@/lib/dbConnect';
import DepartmentModel from '@/model/Department';

export const authOptions: NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                officialEmail: { label: "officialEmail", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                    const department= await DepartmentModel.findOne({
                        officialEmail: credentials.officialEmail
                    })
                    if(!department){
                        throw new Error("No Department found with this email")
                    }
                    if(!department.isVerified){
                        throw new Error("Department still not verified")
                    }
                    const isPasswordCorrect= await bcrypt.compare(credentials.password, department.password)
                    if(isPasswordCorrect)return department;
                    else throw new Error("Incorrect password");
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id=user._id?.toString();
                token.officialEmail=user.officialEmail;
                token.departmentCode=user.departmentCode
                token.departmentName=user.departmentName
            }
            return token
        },
        async session({session,token}){
            if(token){
                session.user._id= token._id
                session.user.officialEmail =token.officialEmail
                session.user.departmentCode=token.departmentCode
                session.user.departmentName=token.departmentName
            }
            return session
        }
    },
    pages:{
        signIn: '/sign-in'
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}