"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Mail, Lock, Info, Phone, MapPin, FileText, Loader2 } from 'lucide-react'
import Link from "next/link"
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { SignUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"


export default function DepartmentSignup() {
  const [departmentCode,setDepartmentCode]=useState("")
  const [isCheckingCode,setIsCheckingCode]=useState(false)
  const [departmentCodeMessage,setDepartmentCodeMessage]=useState("")
  const [isSubmitting,setIsSubmitting]=useState(false)
  const {toast}=useToast()
  const router=useRouter()
  const debounced=useDebounceCallback(setDepartmentCode,300)

  const form=useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues:{
      departmentName:'',
      departmentCode:'',
      officialEmail:'',
      password:'',
      contact:'',
      info:'',
      address:'',
      pinCode:''
    }
  })

  useEffect(()=>{
    const checkDepartmentCodeUnique= async()=>{
      if(departmentCode){
        setIsCheckingCode(true);
        setDepartmentCodeMessage('');
        try {
          const response=await axios.get(`/api/check-deptcode-unique?departmentCode=${departmentCode}`)
          setDepartmentCodeMessage(response.data.message)
        } catch (error) {
          const axiosError=error as AxiosError<ApiResponse>
          setDepartmentCodeMessage(axiosError.response?.data.message??"Error checking department code")
        } finally{
          setIsCheckingCode(false)
        }
      }
    }
    checkDepartmentCodeUnique()
  },[departmentCode])

  const onSubmit=async (data)=>{
    setIsSubmitting(true)
    try {
      const response= await axios.post<ApiResponse>('/api/sign-up',data)
      toast({
        title: "Success",
        description: response.data.message
      })
      router.replace(`/`)
    } catch (error) {
      console.error("Error Department sign up",error)
      const axiosError=error as AxiosError<ApiResponse>
      const errorMessage= axiosError.response?.data.message
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally{
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gray-100 px-4 mt-16">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-5 sm:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Department Signup
              </h1>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                Join the CityConnect network to enhance inter-departmental collaboration.
              </p>
            </motion.div>
            <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="departmentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Department Name"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="departmentCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <Input
                            placeholder="Department Code"
                            {...field}
                            className="pl-10"
                            onChange={(e)=>{
                              field.onChange(e)
                              debounced(e.target.value)
                            }}
                            />
                        </div>
                      </FormControl>
                      {isCheckingCode && <Loader2 className="animate-spin"/>}
                      <p className={`text-sm ${departmentCodeMessage==="Department Code available" ? 'text-green-500' : 'text-red-500' }`}>
                          {departmentCodeMessage}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="officialEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Official Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="Official Email"
                            {...field}
                            className="pl-10"
                            />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <Input
                            type="password"
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
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <Input
                            type="number"
                            placeholder="Contact"
                            {...field}
                            className="pl-10"
                            />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="info"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Information</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Info className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <Textarea placeholder="Department Information" {...field} className="pl-10 h-20"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <Textarea placeholder="Address" {...field} className="pl-10 h-20"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pin Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <Input type="number" placeholder="Pin Code" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-7 items-center justify-center pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {
                    isSubmitting?(
                      <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                      </>
                    ):('SignUp')
                  }
                </Button>
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-gray-900" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </motion.form>
            </Form>
          </div>
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

