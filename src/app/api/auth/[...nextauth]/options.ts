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
                departmentCode: { label: "departmentCode", type: "text"},
                officialEmail: { label: "officialEmail", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                    const dept= await DepartmentModel.findOne({
                        $and:[
                            {officialEmail: credentials.identifier},
                            {departmentCode: credentials.identifier}
                        ]
                    })
                    if(!dept){
                        throw new Error("No Departemtn found with this email and code")
                    }
                    if(!dept.isVerified){
                        throw new Error("Department still not verified")
                    }
                    const isPasswordCorrect= await bcrypt.compare(credentials.password, dept.password)
                    if(isPasswordCorrect)return dept;
                    else throw new Error("Incorrct password")
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
                token.isVerified=user.isVerified;
                token.departmentCode=user.departmentCode
            }
            return token
        },
        async session({session,token}){
            if(token){
                session.user._id= token._id
                session.user.isVerified =token.isVerified
                session.user.departmentCode=token.departmentCode
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