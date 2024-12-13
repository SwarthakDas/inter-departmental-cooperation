"use client"

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, MessageSquare, ArrowRightCircle } from 'lucide-react'
import Link from 'next/link'
import EmployeeNavbar from '@/components/EmployeeNavbar'
import { usePathname } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

export default function EmployeeDashboard() {
  const [notifications, setNotifications] = useState<{ id: number, title: string, date: string}[]>([])
  const [employeeData,setEmployeeData]=useState({
  name: "",
  department: "",
})
  const [discussionTopics, setDiscussionTopics] = useState<{ id: string; title: string; question: string }[]>([]);
  const {toast}=useToast()
  const pathname = usePathname();
  const videoConferenceUrl = `${pathname}/video-conference`;

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

  const getDiscussions = useCallback(async () => {
    try {
      const response = await axios.get<{ success: boolean; discussions: any[] }>('/api/get-discussions');
      if (response.data.success) {
        const topics = response.data.discussions.map((discussion) => ({
          id: discussion._id,
          title: discussion.topic,
          question: discussion.question,
        }));
        setDiscussionTopics(topics);
      } else {
        console.error("Failed to fetch discussions:", response.data);
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  },[]);

  const getConferences = useCallback(async () => {
      try {
        const response = await axios.get<ApiResponse>(`/api/employee-invitation?employeeId=${url}`);
        const conferences = response.data.meetings;
        if (!conferences) throw new Error("No conferences received");
        const conferencesArray = conferences.map((conference, index) => ({
          id: index + 1,
          title: conference["hostName"] || null,
          date: conference["time"],
        }))
        setNotifications(conferencesArray)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data.message || "An error occurred";
        console.error("Error fetching conferences", errorMessage);
        toast({
          title: "Failed to fetch conferences",
          variant: "destructive",
        });
      }
    }, [toast,url])
  
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
      getConferences()
      getDiscussions()
    },[employeeDetails,getConferences,getDiscussions])
    
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
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
                <Link href={videoConferenceUrl} className="flex items-center gap-2 text-blue-500 hover:underline">
                  <ArrowRightCircle className="h-4 w-4" />
                  <span>See All Meetings</span>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications
                    .sort(() => Math.random() - 0.5) 
                    .slice(0, 3)
                    .map((meeting) => (
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
            <Card className="md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discussion Forum</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discussionTopics.sort(() => Math.random() - 0.5).slice(0, 4).map((topic) => (
                      <div
                      key={topic.id}
                      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
                    >
                      <div className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {topic.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {topic.question}
                          </p>
                        </div>
                      </div>
                    </div>
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

