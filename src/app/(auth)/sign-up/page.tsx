"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Mail, Lock, Info, Phone, MapPin, FileText } from 'lucide-react'
import Link from "next/link"
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/hooks/use-toast"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
import { SignUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"


export default function DepartmentSignup() {
  const [departmentCode,setDepartmentCode]=useState("")
  const [isCheckingCode,setIsCheckingCode]=useState(false)
  const [departmentCodeMessage,setDepartmentCodeMessage]=useState("")
  const [isSubmitting,setIsSubmitting]=useState(false)
  const {toast}=useToast()
  const router=useRouter()

  const form=useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues:{
      departmentName:'',
      departmentCode:'',
      officialEmail:'',
      password:'',
      info:'',
      contact:'',
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
            <motion.form
              onSubmit={onSubmit}
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-2">
                <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">Department Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                  <Input id="departmentName" placeholder="Enter department name" className="pl-10" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="departmentCode" className="block text-sm font-medium text-gray-700">Department Code</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                    <Input id="departmentCode" placeholder="Enter department code" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="officialEmail" className="block text-sm font-medium text-gray-700">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                    <Input id="officialEmail" type="email" placeholder="Enter official email" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                    <Input id="password" type="password" placeholder="Enter password" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                    <Input id="contact" type="tel" placeholder="Enter contact number" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="info" className="block text-sm font-medium text-gray-700">Department Info</label>
                  <div className="relative">
                    <Info className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                    <Textarea id="info" placeholder="Enter department information" className="pl-10 h-20" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                    <Textarea id="address" placeholder="Enter department address" className="pl-10 h-20" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Pin Code</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                    <Input id="contact" type="tel" placeholder="Enter Pin Code" className="pl-10" required />
                  </div>
              </div>
              </div>
              <div className="flex flex-col gap-7 items-center justify-center pt-4">
                <Button type="submit" className="ml-4 px-7">
                  Sign Up
                </Button>
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-gray-900" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
              
            </motion.form>
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

