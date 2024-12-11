"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Skeleton } from '@/components/ui/skeleton'

export default function UnavailableDataPage() {
  const { data: session } = useSession()
  const [unavailableEmployees, setUnavailableEmployees] = useState([{ id: 0, name: "", email: "" }])
  const [unavailableInventory, setUnavailableInventory] = useState([{ id: 0, name: "", quantity: 0 }])
  const { toast } = useToast()

  const getEmployees = useCallback(async () => {
    try {
        const departmentName=session?.user.departmentName
        const response=await (await axios.get<ApiResponse>(`/api/get-unavailable-employees?departmentName=${departmentName}`)).data.employees
      if (!response) {
        throw new Error("No unavailable employees data available")
      }
      setUnavailableEmployees(
        response.map((emp, index) => ({
          id: index,
          email: emp.split(",")[1].split(":")[1].trim(),
          name: emp.split(",")[0].split(":")[1].trim(),
        }))
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      console.log("Error fetching unavailable employees", errorMessage)
      toast({
        title: "Employees fetching failed",
        variant: "destructive"
      })
    }
  }, [session, toast])

  const getInventory = useCallback(async () => {
    try {
      const departmentName = session?.user.departmentName
      const response = await (await axios.get<ApiResponse>(`/api/get-unavailable-inventory?departmentName=${departmentName}`)).data.inventory
      if (!response) {
        throw new Error("No unavailable inventory data available")
      }
      setUnavailableInventory(
        response.map((inv, index) => ({
          id: index,
          name: inv["name"],
          quantity: Number(inv["count"])
        }))
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      console.log("Error fetching unavailable inventory", errorMessage)
      toast({
        title: "Inventory fetching failed",
        variant: "destructive"
      })
    }
  }, [session, toast])

  useEffect(() => {
    if (!session || !session.user) return
    getEmployees()
    getInventory()
  }, [session, getEmployees, getInventory])

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto py-10 px-4 pt-20">
          <div className="space-y-6">
            <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/2 rounded-lg" />
              <div className="space-y-2">
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} className="h-6 w-full rounded-lg" />
                ))}
              </div>
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
            <CardTitle className="text-2xl font-bold">Unavailable Employees</CardTitle>
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
                {unavailableEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="my-8"></div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Unavailable Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unavailableInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
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
