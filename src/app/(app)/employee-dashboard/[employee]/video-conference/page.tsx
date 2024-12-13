"use client"

import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

const EmployeeConferencePage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [conferenceInvitations, setConferenceInvitations] = useState<{ id: number, title: string, hostDepartment: string, startTime: Date, hostId: string }[]>([])
  const [selectedConference, setSelectedConference] = useState(conferenceInvitations[0])
  const pathname = usePathname();
  const match = pathname.match(/employee=([^/]+)/);
  const employeeId = match ? match[1] : null;

  const handleJoinConference = () => {
    router.replace(`/employee-dashboard/${employeeId}/video-conference/${selectedConference.hostId}`)
  }
  const getConferences = useCallback(async () => {
    try {
        
      const response = await axios.get<ApiResponse>(`/api/employee-invitation?employeeId=${employeeId}`);
      const conferences = response.data.meetings;
      if (!conferences) throw new Error("No conferences received");
      const conferencesArray = conferences.map((conference, index) => ({
        id: index + 1,
        title: conference["title"] || null,
        hostDepartment: conference["hostName"],
        startTime: conference["time"],
        hostId: conference["hostId"]
      }))
      setConferenceInvitations(conferencesArray)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "An error occurred";
      console.error("Error fetching conferences", errorMessage);
      toast({
        title: "Failed to fetch conferences",
        variant: "destructive",
      });
    }
  }, [toast,employeeId])

  useEffect(() => {
    if(!pathname)return;
    getConferences()
  }, [getConferences,pathname])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Conferences</h1>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Conference Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {conferenceInvitations.map((conference) => (
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
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Host: {conference.hostDepartment}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {new Date(conference.startTime).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
              {selectedConference && (
                <div className="mt-4 flex justify-center">
                  <Button onClick={handleJoinConference}>
                    Join Conference
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default EmployeeConferencePage
