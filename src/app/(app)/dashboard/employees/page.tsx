"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function EmployeesPage() {
    const {data:session}=useSession()
    const [employees,setEmployees] = useState([{id:0,name:"",email:""}])
    const {toast}=useToast()
    const departmentEmployee=useCallback(async()=>{
        try {
            const departmentName=session?.user.departmentName
            const response=await (await axios.get<ApiResponse>(`/api/get-employees-page?departmentName=${departmentName}`)).data.employees
            if (!response) {
              throw new Error("No employees data available");
            }
            setEmployees(
              response.map((emp,index) => ({
                id: index,
                email: emp.split(",")[1].split(":")[1].trim(),
                name: emp.split(",")[0].split(":")[1].trim(),
              }))
            )
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

    useEffect(()=>{
        if(!session || !session.user) return
        departmentEmployee()
      },[session,departmentEmployee])

    if(!session||!session.user){
        return (
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <main className="container mx-auto py-10 px-4 pt-20">
                <div className="space-y-6">
                  <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-1/2 rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-6 w-full rounded-lg" />
                    <Skeleton className="h-6 w-2/3 rounded-lg" />
                  </div>
                </div>
              </main>
            </div>
          );
    }
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 pt-20">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Employees</CardTitle>
            <Link href="/dashboard/employee-registration">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Register New Employee
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

