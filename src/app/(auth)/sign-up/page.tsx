"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Mail, Lock, Info, Phone, MapPin, FileText } from 'lucide-react'
import Link from "next/link"
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'

export default function DepartmentSignup() {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gray-100 px-4 mt-20">
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
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-2">
                <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">Department Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input id="departmentName" placeholder="Enter department name" className="pl-10" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="departmentCode" className="block text-sm font-medium text-gray-700">Department Code</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="departmentCode" placeholder="Enter department code" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="officialEmail" className="block text-sm font-medium text-gray-700">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="officialEmail" type="email" placeholder="Enter official email" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="password" type="password" placeholder="Enter password" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="contact" type="tel" placeholder="Enter contact number" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="info" className="block text-sm font-medium text-gray-700">Department Info</label>
                  <div className="relative">
                    <Info className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea id="info" placeholder="Enter department information" className="pl-10 h-20" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea id="address" placeholder="Enter department address" className="pl-10 h-20" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Pin Code</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="contact" type="tel" placeholder="Enter Pin Code" className="pl-10" required />
                  </div>
              </div>
              </div>
              <div className="flex items-center justify-center pt-6">
                <Button type="submit" className="ml-4 px-5">
                  Sign Up
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-gray-900" href="#">
                    Terms & Conditions
                  </Link>
                </p>
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

