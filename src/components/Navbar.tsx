"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import Image from 'next/image'
const Navbar = () => {
  return (
    <div>
      <motion.header
        className="px-4 lg:px-6 h-16 flex items-center fixed top-0 left-0 right-0 z-10 bg-white bg-opacity-90 backdrop-blur-md justify-between shadow-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Link className="flex items-center justify-center" href="#">
          <Building2 className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">CityConnect</span>
        </Link>
        <Image height={60} width={60} src={"/images/ashokStambh.png"} alt='404'/>
      </motion.header>
    </div>
  )
}

export default Navbar
