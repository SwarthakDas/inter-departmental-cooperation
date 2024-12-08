"use client"

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
import { useRouter } from "next/navigation"

export default function ConflictsPage() {
  const {data:session}=useSession()
  const [conflicts,setConflicts]=useState([{id:0,name:"",quantity:0,title:"",description:""}])
  const {toast}=useToast()
  const router=useRouter()

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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Navbar />
          <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 pt-20">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Conflicts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {conflicts.map((conflict) => (
                      <Button 
                      onClick={() => handleClick(conflict.id, conflict.name, conflict.title, conflict.description)}
                        key={conflict.id}
                        variant="outline"
                        className="w-full h-full justify-start text-left transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex flex-col items-start space-y-2 p-4">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <span className="font-semibold text-lg text-gray-800 dark:text-white">{conflict.title || "Project Title not found"}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">with {conflict.name}</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{conflict.description || "Description not found"}</p>
                        </div>
                      </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      )
      
}

