"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, Mail } from 'lucide-react'
import Link from "next/link"
import Navbar from '@/components/Navbar'
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { SignInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'



export default function DepartmentSignin() {
  const {toast}=useToast()
  const router=useRouter()

  const form=useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues:{
      officialEmail:'',
      password:''
    }
  })

  const onSubmit= async(data: z.infer<typeof SignInSchema>)=>{
    const result= await signIn('credentials',{
      redirect:false,
      officialEmail: data.officialEmail,
      password: data.password
    })
    if(result?.error){
      if(result.error=='CredentialsSignin'){
        toast({
          title: "Login failed",
          description: "Incorrect Email or password",
          variant: "destructive"
        })
      } else{
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        })
      }
    }
    if(result?.url)router.replace('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Department Sign In
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your department code and username to access your account
            </p>
          </motion.div>
          <Form {...form}>
          <motion.form 
            className="mt-8 space-y-6" 
            onSubmit={form.handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="officialEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Department Email"
                              {...field}
                              className="pl-10"
                              />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                            <Input
                              type='password'
                              placeholder="Password"
                              {...field}
                              className="pl-10"
                              />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
              >
                Sign in
              </Button>
            </div>
            </div>
          </motion.form>
          </Form>
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm">
              <Link href="/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up for a new account
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 CityConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

