"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for upcoming conferences
const upcomingConferences = [
  {
    id: 1,
    title: "City Planning Meeting",
    departments: [
      {
        name: "Urban Planning",
        employees: ["john.doe@cityconnect.gov", "jane.smith@cityconnect.gov"]
      },
      {
        name: "Transportation",
        employees: ["mike.ross@cityconnect.gov", "rachel.green@cityconnect.gov"]
      }
    ],
    startTime: new Date(Date.now() + 3600000) // 1 hour from now
  },
  {
    id: 2,
    title: "Environmental Impact Discussion",
    departments: [
      {
        name: "Environmental",
        employees: ["phoebe.buffay@cityconnect.gov", "joey.tribbiani@cityconnect.gov"]
      },
      {
        name: "Urban Planning",
        employees: ["chandler.bing@cityconnect.gov", "monica.geller@cityconnect.gov"]
      }
    ],
    startTime: new Date(Date.now() + 7200000) // 2 hours from now
  },
  {
    id: 3,
    title: "Budget Review",
    departments: [
      {
        name: "Finance",
        employees: ["ross.geller@cityconnect.gov", "gunther.central@cityconnect.gov"]
      },
      {
        name: "Urban Planning",
        employees: ["john.doe@cityconnect.gov", "jane.smith@cityconnect.gov"]
      },
      {
        name: "Transportation",
        employees: ["mike.ross@cityconnect.gov", "rachel.green@cityconnect.gov"]
      }
    ],
    startTime: new Date(Date.now() + 10800000) // 3 hours from now
  }
]

const VideoConferencePage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const departmentId = session?.user._id

  // State to manage the selected conference and hover effect
  const [selectedConference, setSelectedConference] = useState(upcomingConferences[0] || null)
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = () => {
    if (selectedConference) {
      router.push(`/dashboard/video-conference/${departmentId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Video Conferences</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Upcoming Conferences</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {upcomingConferences.map((conference) => (
                    <Card
                      key={conference.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedConference?.id === conference.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedConference(conference)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{conference.title}</h3>
                        <div className="space-y-2">
                          {conference.departments.map((dept, index) => (
                            <div key={index}>
                              <p className="font-medium">{dept.name}</p>
                              <ul className="list-disc list-inside pl-4 text-sm text-gray-600">
                                {dept.employees.map((email, emailIndex) => (
                                  <li key={emailIndex}>{email}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{conference.startTime.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Conference Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedConference ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{selectedConference.title}</h2>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Participating Departments:</span>
                  </div>
                  <ul className="list-disc list-inside pl-5 space-y-1">
                    {selectedConference.departments.map((dept, index) => (
                      <li key={index} className="text-gray-600">{dept.name}</li>
                    ))}
                  </ul>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Date:</span>
                    <span className="text-gray-600">
                      {selectedConference.startTime.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Start Time:</span>
                    <span className="text-gray-600">
                      {selectedConference.startTime.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-center mt-6">
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
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">Select a conference to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default VideoConferencePage
