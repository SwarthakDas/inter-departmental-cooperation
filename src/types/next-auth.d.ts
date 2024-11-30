import "next-auth"
import { DefaultSession } from "next-auth"

declare module 'next-auth'{
    interface User{
        _id?: string;
        officialEmail?: string;
        departmentCode?: string;
        departmentName?:string;
    }
    interface Session{
        user:{
            _id?: string;
            officialEmail?: string;
            departmentCode?: string;
            departmentName?:string;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string;
        officialEmail?: string;
        departmentCode?: string;
        departmentName?:string;
    }
}