"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

export default function ConflictResolutionPage() {
  const {data:session}=useSession()
  const {toast}=useToast()
  const [resolutions, setResolutions] = useState( [
    "Establish a joint task force with representatives from all conflicting departments to collaboratively develop an integrated plan that addresses concerns from each department.",
    "Conduct a series of workshops and design charrettes involving all stakeholders to find creative solutions that balance the needs of urban development, transportation efficiency, and environmental conservation.",
    "Implement a phased approach to the redevelopment, allowing for iterative feedback and adjustments from each department at key milestones throughout the project timeline."
  ])
  const specialChar = '||';
  const parseStringMessages = (messageString: string): string[] => {
    return messageString
      .split(specialChar)
      .map(msg => msg.replace(/^"|"$/g, ''));
  };

  const searchParams = useSearchParams();
  const otherDepartments = searchParams.get('name') || '';
  const title = searchParams.get('title') || '';
  const description = searchParams.get('description') || '';
  const myDepartment = searchParams.get('departmentName') || '';


  async function handleGenerateAgain(){
    try {
      const values = {
        myDepartment,
        otherDepartments,
        title,
        description,
      }
      const response = (await axios.post<ApiResponse>(`/api/suggest-conflict-resolution`, values)).data
      if (!response) {
        throw new Error("No Inventory data available");
      }
      const result=response["questions"]
      setResolutions(parseStringMessages(result))
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      const errorMessage=axiosError.response?.data.message
      console.log("Error fetching Inventory",errorMessage)
      toast({
        title:"Inventory fetching failed",
        variant: "destructive"
      })
    }
}

useEffect(()=>{
  if(!session || !session.user) return
},[session])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 pt-24">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 w-72">
            <h2 className="text-xl font-semibold mb-2">Conflicting Departments</h2>
            <p className="text-gray-600 text-sm">{otherDepartments}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {resolutions.map((resolution, index) => (
            <Card key={index} className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Resolution {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{resolution}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button onClick={handleGenerateAgain} className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" /> Generate Again
          </Button>
        </div>
      </main>
    </div>
  )
}
