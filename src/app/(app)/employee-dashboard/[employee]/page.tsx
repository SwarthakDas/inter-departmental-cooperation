"use client"

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, MessageSquare, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import EmployeeNavbar from '@/components/EmployeeNavbar'
import { usePathname } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

// Mock data (replace with actual data fetching in a real application)
// const employeeData = 

const upcomingMeetings = [
  { id: 1, title: "Weekly Team Sync", date: "2024-03-15T10:00:00Z" },
  { id: 2, title: "Project Review", date: "2024-03-16T14:30:00Z" },
  { id: 3, title: "Budget Planning", date: "2024-03-17T11:00:00Z" },
]

const discussionTopics = [
  { id: 1, title: "City Infrastructure", url: "/forum/city-infrastructure" },
  { id: 2, title: "Public Transportation", url: "/forum/public-transportation" },
  { id: 3, title: "Environmental Initiatives", url: "/forum/environmental-initiatives" },
  { id: 4, title: "Community Events", url: "/forum/community-events" },
]

export default function EmployeeDashboard() {
  const [notifications, setNotifications] = useState(upcomingMeetings)
  const [employeeData,setEmployeeData]=useState({
  name: "",
  department: "",
})
  const {toast}=useToast()

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  const url=usePathname().split("employee=")[1]
  console.log(url)
  
    const employeeDetails= useCallback(async()=>{
      try {
      console.log(url)
      const response= await axios.get<ApiResponse>(`/api/get-employee-details?employeeId=${url}`)
      setEmployeeData({name:response.data.employeeName as string,department:response.data.underDepartment as string})
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      const errorMessage= axiosError.response?.data.message
      console.error("Error fetching details",errorMessage)
      toast({
        title:"Error fetching details",
        variant: "destructive"
      })
    }
    },[url,toast]) 

    useEffect(()=>{
      if(!employeeDetails) return
      employeeDetails()
    },[employeeDetails])
    
    if(!employeeDetails){
      return (
        <div className="flex flex-col space-y-6 p-6">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              ))}
          </div>
        </div>
      );
    }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeNavbar/>
      <main className="max-w-7xl mt-16 mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employee Badge */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Badge</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage alt={employeeData.name} />
                  <AvatarFallback>{employeeData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{employeeData.name}</h2>
                  <p className="text-gray-500">{employeeData.department}</p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((meeting) => (
                    <div key={meeting.id} className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-4">
                        <Bell className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{meeting.title}</h3>
                        <p className="text-sm text-gray-500">{formatDate(meeting.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Discussion Forum */}
            <Card className="md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discussion Forum</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discussionTopics.map((topic) => (
                    <Link key={topic.id} href={topic.url} className="block">
                      <Button variant="outline" className="w-full justify-between">
                        {topic.title}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

