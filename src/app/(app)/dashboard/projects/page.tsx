"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { FileText } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Skeleton } from '@/components/ui/skeleton'

function formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateProgress(startDate: string, endDate: string): number {
  startDate=formatDate(startDate)
  endDate=formatDate(endDate)
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = new Date().getTime()

  if (now <= start) return 0
  if (now >= end) return 100

  const total = end - start
  const current = now - start
  return Math.round((current / total) * 100)
}


export default function ProjectsPage() {
  const {data:session}=useSession()
  const [projects,setProjects]=useState([{id:0,title:"",description:"",startDate:"2024-01-01",endDate:"2025-01-01"}])
  const {toast}=useToast()

    const getprojects=useCallback(async()=>{
      try {
        const departmentCode=session?.user.departmentCode
        const response=await (await axios.get<ApiResponse>(`/api/get-projects?departmentCode=${departmentCode}`)).data.projects
        if (!response) {
          throw new Error("No Inventory data available");
        }
        setProjects(
          response.map((proj, index) => ({
            id:index,
            title: proj["title"],
            description: proj["description"],
            startDate: (new Date(proj["startDate"])).toString().split(" ").slice(0, 4).join(" "),
            endDate: (new Date(proj["endDate"])).toString().split(" ").slice(0, 4).join(" ")
          }))
        )
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage=axiosError.response?.data.message
        console.log("Error fetching Inventory",errorMessage)
        toast({
          title:"Inventory fetching failed",
          variant: "destructive"
        })
      }
},[toast,session])

  useEffect(()=>{
    if(!session || !session.user) return
      getprojects()
  },[session,getprojects])

  if(!session||!session.user){
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
            <CardTitle className="text-2xl font-bold">Projects</CardTitle>
            <Link href="/dashboard/register-project">
              <Button>
                <FileText className="mr-2 h-4 w-4" /> Register New Project
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const progress = calculateProgress(project.startDate, project.endDate)
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell className="font-medium">{project.description}</TableCell>
                      <TableCell>{project.startDate}</TableCell>
                      <TableCell>{project.endDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={progress} className="w-[60%]" />
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

