"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from '@/components/Navbar'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Video } from 'lucide-react'

interface Employee {
  id: number
  name: string
  email: string
  selected: boolean
}

export default function EmployeeVideoConferencePage() {
  const { data: session } = useSession()
  const [employees, setEmployees] = useState<Employee[]>([])
  const { toast } = useToast()

  const departmentEmployee = useCallback(async () => {
    try {
      const departmentName = session?.user.departmentName
      const response = await (await axios.get<ApiResponse>(`/api/get-employees-page?departmentName=${departmentName}`)).data.employees
      if (!response) {
        throw new Error("No employees data available")
      }
      setEmployees(
        response.map((emp, index) => ({
          id: index,
          email: emp.split(",")[1].split(":")[1].trim(),
          name: emp.split(",")[0].split(":")[1].trim(),
          selected: false,
        }))
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      console.log("Error fetching employees", errorMessage)
      toast({
        title: "Employees fetching failed",
        variant: "destructive"
      })
    }
  }, [session, toast])

  useEffect(() => {
    if (!session || !session.user) return
    departmentEmployee()
  }, [session, departmentEmployee])

  const toggleEmployeeSelection = (id: number) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, selected: !emp.selected } : emp
    ))
  }

  const inviteSelected = async () => {
    try {
        const departmentName = session?.user.departmentName;
        const selectedEmails = employees.filter(emp => emp.selected).map(emp => emp.email);
        
        const payload = { employees: selectedEmails };
        await axios.post(`/api/add-employees-to-meetings?departmentName=${departmentName}`, payload);

        toast({
            title: "Invitation Sent",
            description: `Invited ${selectedEmails.length} employee(s) to the video conference.`,
        });
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data.message;
        console.log("Error inviting employees", errorMessage);

        toast({
            title: "Employees inviting failed",
            variant: "destructive",
            description: errorMessage || "An unexpected error occurred.",
        });
    }
  };


  if (!session || !session.user) {
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 pt-20">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Invite Employees to Upcoming Video Conferences</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox
                        checked={employee.selected}
                        onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button onClick={inviteSelected}>
                <Video className="mr-2 h-4 w-4" />
                Invite Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

