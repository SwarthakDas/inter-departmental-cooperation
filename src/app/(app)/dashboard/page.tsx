"use client"

import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Package, FileText, BarChart2, Clock, Mail, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { MeetingScheduler } from '@/components/MeetingScheduler'

const departmentStats = [
  { label: "Conflicts Resolved", value: 15, icon: BarChart2 },
  { label: "Employees", value: 28, icon: Users },
  { label: "Resources Shared", value: 45, icon: Package },
  { label: "Meetings Held", value: 32, icon: Clock },
  { label: "Member Since", value: "2020", icon: Calendar },
  { label: "Requests Made", value: 67, icon: Mail },
  { label: "Invites Sent", value: 23, icon: UserPlus }
]

export default function DepartmentDashboard() {
  const {data: session}= useSession()
  const [departmentData,setDepartmentData] = useState({
      departmentName: "",
      departmentCode: "",
      officialEmail: "",
      info: "",
      contact: 0,
      address: ""
  })
  const [employees,setEmployees] = useState([""])
  const [conflictingDepartments,setConflictingDepartments] =useState([""])
  const [meetingDept,setMeetingDept]=useState([""])

  useEffect(()=>{
    const departmentDetails=async()=>{
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
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage=axiosError.response?.data.message
        console.error("Error fetching details",errorMessage)
      }
    }
    departmentDetails()
  },[session])

  useEffect(()=>{
    const departmentEmployees=async()=>{
      try {
        const departmentCode=session?.user.departmentCode
        const response=await axios.get<ApiResponse>(`/api/get-employees?departmentCode=${departmentCode}`)
        if(response.data.employees?.length==0)setEmployees(["No employes to show"]);
        else setEmployees(response.data.employees as []);
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage=axiosError.response?.data.message
        console.log("Error fetching employees",errorMessage)
      }
    }
    departmentEmployees()
  },[session])

  useEffect(()=>{
    const departmentConflicts=async()=>{
      try {
        const departmentCode=session?.user.departmentCode
        const response=await axios.get<ApiResponse>(`/api/get-conflicts?departmentCode=${departmentCode}`)
        if(response.data.conflicts?.length==0)setEmployees(["No Conflicts to show"]);
        else setConflictingDepartments(response.data.conflicts as [])
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage=axiosError.response?.data.message
        console.log("Error fetching employees",errorMessage)
      }
    }
    departmentConflicts()
  },[session])

  
  useEffect(()=>{
    const sameAreaDepartments=async()=>{
      try {
        const departmentCode=session?.user.departmentCode
        const response=await axios.get<ApiResponse>(`/api/get-area-departments?departmentCode=${departmentCode}`)
        setMeetingDept(response.data.sameAreaDepartments as [])
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage=axiosError.response?.data.message
        console.log("Error fetching departments in area",errorMessage)
      }
    }
    sameAreaDepartments()
  },[session])

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
                      <Link href="/calendar" className="block">
                        <Button className="w-full h-20 text-sm" variant="outline">
                          <Calendar className="mr-2 h-5 w-5" /> View Calendar
                        </Button>
                      </Link>
                      <Link href="/resource-request" className="block">
                        <Button className="w-full h-20 text-sm" variant="outline">
                          <Package className="mr-2 h-5 w-5" /> Request Resources
                        </Button>
                      </Link>
                      <Link href="/employee-registration" className="block">
                        <Button className="w-full h-20 text-sm" variant="outline">
                          <Users className="mr-2 h-5 w-5" /> Register Employees
                        </Button>
                      </Link>
                      <Link href="/inventory-registration" className="block">
                        <Button className="w-full h-20 text-sm" variant="outline">
                          <Package className="mr-2 h-5 w-5" /> Register Inventory
                        </Button>
                      </Link>
                      <Link href="/project-registration" className="block col-span-2">
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
                    {conflictingDepartments
                    .filter((dept) => dept !== null) // Filter out null values
                    .map((dept, index) => (
                      <Link href={`/conflicts/${index}`} key={index} className="block">
                        <Button variant="outline" className="w-full justify-between">
                          <span>{dept}</span>
                          <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                            Conflicted
                          </span>
                        </Button>
                      </Link>
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
                    {employees.map((employee, index) => (
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

