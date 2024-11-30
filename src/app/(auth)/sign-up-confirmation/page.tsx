"use client"

import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { CheckCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function SignupConfirmation() {
  const controls = useAnimation()

  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3 }
    }))
  }, [controls])

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            custom={0}
          >
            <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
          </motion.div>
          <motion.h2
            className="mt-6 text-3xl font-extrabold text-gray-900"
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            custom={1}
          >
            Signup Complete!
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-gray-600"
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            custom={2}
          >
            Thank you for signing up. Your Department is currently pending verification.
          </motion.p>
          <motion.div
            className="mt-5 p-4 bg-blue-100 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            custom={3}
          >
            <Phone className="mx-auto h-12 w-12 text-blue-500 mb-2" />
            <p className="text-sm text-blue-800">
              Please await a verification call on your registered contact number. Our team will reach you shortly to complete the verification process.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            custom={4}
          >
            <Link href="/">
              <Button className="mt-8 w-44">
                Return to Home Page
              </Button>
            </Link>
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

