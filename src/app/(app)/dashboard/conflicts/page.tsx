"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

export default function ConflictsPage() {
  const {data:session}=useSession()
  const [conflicts,setConflicts]=useState([{id:0,name:"",quantity:0}])
  const {toast}=useToast()

    const getConflicts=useCallback(async()=>{
      try {
        const departmentCode=session?.user.departmentCode
        const response=await (await axios.get<ApiResponse>(`/api/get-conflicts?departmentCode=${departmentCode}`)).data.conflicts
        if (!response) {
          throw new Error("No Inventory data available");
        }
        setConflicts(
          response.map((conflict, index) => ({
            id:index,
            name: conflict,
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

    useEffect(()=>{
        if(!session || !session.user) return
        getConflicts()
      },[session,getConflicts])

      if(!session||!session.user){
        return (
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto py-10 px-4 pt-20">
              <div className="space-y-6">
                <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} className="h-10 w-full rounded-lg" />
                  ))}
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
            <CardTitle className="text-2xl font-bold">Conflicts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {conflicts.map((conflict) => (
                <Link key={conflict.id} href={`/conflicts/${conflict.id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{conflict.name}</span>
                      {/* <span className="text-sm text-gray-500">with {conflict.name} Department</span> */}
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

