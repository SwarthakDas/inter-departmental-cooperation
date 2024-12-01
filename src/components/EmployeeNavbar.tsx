"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast'



const EmployeeNavbar = () => {
  const {toast}=useToast()
  const logOut=()=>{
    try {
        toast({
            title:"Success",
            description: "Successfully logged out"
        })
    } catch (error) {
        console.error(error)
        toast({
            title:"Error",
            description: "Error logging out"
        })
    }
  }

  return (
    <div>
      <motion.header
        className="px-4 lg:px-6 h-16 flex items-center fixed top-0 left-0 right-0 z-10 bg-white bg-opacity-90 backdrop-blur-md justify-between shadow-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Link className="flex items-center justify-center" href="#">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">CityConnect</span>
        </Link>
        <div className='flex items-center space-x-4'>
            <Link href="employee-sign-in"></Link>
            <Button variant="outline" size="sm" onClick={() => logOut()}>Logout</Button>
          <Image height={60} width={60} src="/images/ashokStambh.png" alt='Ashok Stambh' />
        </div>
      </motion.header>
    </div>
  )
}

export default EmployeeNavbar

