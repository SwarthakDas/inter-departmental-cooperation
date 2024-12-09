"use client"

import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Package, FileText, BarChart2, Clock, Mail, UserPlus, MessageCircle, Inbox, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { MeetingScheduler } from '@/components/MeetingScheduler'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function DepartmentDashboard() {
  const {data: session}= useSession()
  const {toast}=useToast()
  const [departmentData,setDepartmentData] = useState({
      departmentName: "",
      departmentCode: "",
      officialEmail: "",
      info: "",
      contact: 0,
      address: ""
  })
  const [employees,setEmployees] = useState([""])
  const [conflicts,setConflicts]=useState([{id:0,name:"",quantity:0,title:"",description:""}])
  const [meetingDept,setMeetingDept]=useState([""])
  const [departmentStats,setDepartmentStats]=useState([
    { label: "Conflicts Resolved", value: 15, icon: BarChart2 },
  { label: "Employees", value: 28, icon: Users },
  { label: "Resources Shared", value: 45, icon: Package },
  { label: "Meetings Held", value: 32, icon: Clock },
  { label: "Member Since", value: "2020", icon: Calendar },
  { label: "Requests Made", value: 67, icon: Mail },
  { label: "Requests Received", value: 45, icon: Inbox },
  { label: "Invites Sent", value: 23, icon: UserPlus },
  { label: "Invites Received", value: 12, icon: MessageCircle }
  ])
  const router=useRouter()

  const departmentStatistics=useCallback(async(refresh:boolean=false)=>{
    try {
      const departmentCode=session?.user.departmentCode
      const response=(await axios.get<ApiResponse>(`/api/get-department-stats?departmentCode=${departmentCode}`)).data.departmentStats
      if(!response) throw new Error;
      const updatedStats = [
        { label: "Conflicts Resolved", value: response["Conflicts Resolved"], icon: BarChart2 },
        { label: "Employees", value: response["Employees"], icon: Users },
        { label: "Resources Shared", value: response["Resources Shared"], icon: Package },
        { label: "Meetings Held", value: response["Meetings Held"], icon: Clock },
        { label: "Member Since", value: response["Member Since"], icon: Calendar },
        { label: "Requests Made", value: response["Requests Made"], icon: Mail },
        { label: "Requests Received", value: response["Requests Received"], icon: Inbox },
        { label: "Invites Sent", value: response["Invites Sent"], icon: UserPlus },
        { label: "Invites Received", value: response["Invites Received"], icon: MessageCircle }
      ];
      setDepartmentStats(updatedStats)
      if(refresh){
        toast({
          title:"Department details fetched",
        })
      }
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      const errorMessage=axiosError.response?.data.message
      console.error("Error fetching details",errorMessage)
      toast({
        title:"Department details not found",
        variant: "destructive"
      })
    }
  },[session,toast])

    const departmentDetails=useCallback(async(refresh:boolean=false)=>{
      try {
        const departmentCode=session?.user.departmentCode
        const response=await axios.get<ApiResponse>(`/api/get-department-details?departmentCode=${departmentCode}`)
        setDepartmentData({
          departmentName:response.data.departmentName as string,
          departmentCode: response.data.departmentCode as string,
          officialEmail: response.data.departmentEmail as string,
          info: response.data.departmentInfo as string,
          contact: response.data.departmentContact as number,
          address: response.data.departmentAddress as string
        })
        if(refresh){
          toast({
            title:"Department details fetched",
          })
        }
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage=axiosError.response?.data.message
        console.error("Error fetching details",errorMessage)
        toast({
          title:"Department details not found",
          variant: "destructive"
        })
      }
    },[session,toast])

    const departmentEmployee=useCallback(async()=>{
      try {
        const departmentCode=session?.user.departmentCode
        const response=await axios.get<ApiResponse>(`/api/get-employees?departmentCode=${departmentCode}`)
        if(response.data.employees?.length==0)setEmployees(["No employes to show"]);
        else setEmployees(response.data.employees as []);
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage=axiosError.response?.data.message
        console.log("Error fetching employees",errorMessage)
        toast({
          title:"Employees fetching failed",
          variant: "destructive"
        })
      }
  },[session,toast])

  const getConflicts=useCallback(async()=>{
    try {
      const departmentCode=session?.user.departmentCode
      const response=await (await axios.get<ApiResponse>(`/api/get-conflicts?departmentCode=${departmentCode}`)).data.conflicts
      if (!response) {
        throw new Error("No Inventory data available");
      }
      const mergedConflicts = Object.values(
        response.reduce((acc, conflict) => {
          const key = `${conflict["title"]}-${conflict["description"]}`;
      
          if (!acc[key]) {
            acc[key] = { ...conflict };
          } else {
            acc[key]["departmentName"] += `, ${conflict["departmentName"]}`;
          }
      
          return acc;
        }, {} as Record<string, typeof response[0]>)
      );
      setConflicts(
        mergedConflicts.map((conflict) => ({
          id:conflict["_id"],
          name: conflict["departmentName"],
          title: conflict["title"],
          description: conflict["description"],
          quantity: 0
        }))
      )
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      const errorMessage=axiosError.response?.data.message
      console.log("Error fetching conflicts",errorMessage)
      toast({
        title:"conflict fetching failed",
        variant: "destructive"
      })
    }
},[toast,session])

  
    const sameAreaDepartments=useCallback(async()=>{
      try {
        const departmentCode=session?.user.departmentCode
        const response=await axios.get<ApiResponse>(`/api/get-area-departments?departmentCode=${departmentCode}`)
        setMeetingDept(response.data.sameAreaDepartments as [])
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage=axiosError.response?.data.message
        console.log("Error fetching departments in area",errorMessage)
        toast({
          title:"Error fetching departments in area",
          variant: "destructive"
        })
      }
    },[session,toast])

    async function handleClick(id, name, title, description){
      const departmentName=session?.user.departmentName
      const queryParams = new URLSearchParams({
        name: name,
        title: title,
        description: description,
        departmentName: departmentName || ''
      }).toString();
      router.replace(`/dashboard/conflict-resolution/id=${id.toString()}?${queryParams}`);
    };
  
  useEffect(()=>{
    if(!session || !session.user) return
    departmentDetails()
    departmentStatistics()
    departmentEmployee()
    getConflicts()
    sameAreaDepartments()
  },[session,departmentDetails,departmentEmployee,getConflicts,sameAreaDepartments,departmentStatistics])

  if(!session || !session.user){
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <MeetingScheduler meetingDept={meetingDept} selfDept={departmentData.departmentName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-14">
          <div className="container mx-auto px-6 py-8">
            <h1 className="sm:text-3xl font-semibold text-gray-900 ml-14 text-xl mt-1 sm:mt-0">Department Dashboard</h1>
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Department Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{departmentData.departmentName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Code</dt>
                        <dd className="mt-1 text-sm text-gray-900">{departmentData.departmentCode}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{departmentData.officialEmail}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Info</dt>
                        <dd className="mt-1 text-sm text-gray-900">{departmentData.info}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Contact</dt>
                        <dd className="mt-1 text-sm text-gray-900">{departmentData.contact}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{departmentData.address}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Department Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {departmentStats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                          <stat.icon className="h-8 w-8 text-blue-500 mb-2" />
                          <p className="text-lg font-semibold">{stat.value}</p>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/dashboard/calendar" className="block">
                        <Button className="w-full h-20 text-sm" variant="outline">
                          <Calendar className="mr-2 h-5 w-5" /> View Calendar
                        </Button>
                      </Link>
                      <Link href="/dashboard/communicate" className="block">
                        <Button className="w-full h-20 text-sm" variant="outline">
                          <MessageSquare className="mr-2 h-5 w-5" /> Communicate
                        </Button>
                      </Link>
                      <Link href="/dashboard/employee-registration" className="block">
                        <Button className="w-full h-20 text-sm" variant="outline">
                          <Users className="mr-2 h-5 w-5" /> Register Employees
                        </Button>
                      </Link>
                      <Link href="/dashboard/register-inventory" className="block">
                        <Button className="w-full h-20 text-sm" variant="outline">
                          <Package className="mr-2 h-5 w-5" /> Register Inventory
                        </Button>
                      </Link>
                      <Link href="/dashboard/register-project" className="block col-span-2">
                        <Button className="w-full h-20 text-sm" variant="default">
                          <FileText className="mr-2 h-5 w-5" /> Register New Project
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Conflicts with Other Departments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {conflicts
                        .filter((dept) => dept !== null) // Filter out null values
                        .sort(() => Math.random() - 0.5) // Shuffle the array randomly
                        .slice(0, 4)
                        .map((dept, index) => (
                          <div key={index} className="block">
                            <Button
                             onClick={() => handleClick(dept["id"], dept["name"], dept["title"], dept["description"])} 
                            variant="outline" className="w-full flex items-center justify-between p-4">
                              <div className="flex flex-row gap-10 space-y-1">
                                <span className="text-base font-semibold text-gray-900">{dept["title"] ||"null"}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-800">{dept["departmentName"]}</span>
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                  Conflicted
                                </span>
                              </div>
                            </Button>
                          </div>
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                      Conflict resolution is aided by AI-driven solutions for efficient problem-solving.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Department Employees</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {employees
                        .sort(() => Math.random() - 0.5) // Shuffle the array randomly
                        .slice(0, 5) // Select the first 5 elements
                        .map((employee, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                                <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                                <p className="text-sm font-medium">{employee}</p>
                            </div>
                    ))}
                </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

