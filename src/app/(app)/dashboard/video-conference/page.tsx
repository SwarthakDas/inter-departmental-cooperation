"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'

// Mock data for conference details (replace with actual data in a real application)
const conferenceDetails = {
  departments: ["Transportation", "Environmental", "Urban Planning"],
  startTime: new Date(Date.now() + 3600000) // 1 hour from now
}

const VideoConferencePage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const departmentId = session?.user._id
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = () => {
    router.push(`/dashboard/video-conference/${departmentId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Video Conference</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Conference Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Participating Departments:</span>
                </div>
                <ul className="list-disc list-inside pl-5 space-y-1">
                  {conferenceDetails.departments.map((dept, index) => (
                    <li key={index} className="text-gray-600">{dept}</li>
                  ))}
                </ul>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-600">
                    {conferenceDetails.startTime.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Start Time:</span>
                  <span className="text-gray-600">
                    {conferenceDetails.startTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Join Conference</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-600 mb-6 text-center">
                Click the button below to join the video conference with the participating departments.
              </p>
              <Button
                onClick={handleSubmit}
                className={`px-6 py-3 text-lg transition-all duration-300 transform ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Start Conference
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default VideoConferencePage

