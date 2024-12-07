"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { FileText } from 'lucide-react'
import Navbar from '@/components/Navbar'

// Mock data
const projects = [
  { id: 1, name: "City Park Renovation", startDate: "2023-01-01", endDate: "2023-12-31" },
  { id: 2, name: "Smart Traffic System Implementation", startDate: "2023-03-15", endDate: "2024-03-14" },
  { id: 3, name: "Public Library Expansion", startDate: "2023-06-01", endDate: "2024-05-31" },
  { id: 4, name: "Green Energy Initiative", startDate: "2023-09-01", endDate: "2025-08-31" },
  { id: 5, name: "Community Center Construction", startDate: "2023-11-01", endDate: "2024-10-31" },
]

function calculateProgress(startDate: string, endDate: string): number {
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
                  <TableHead>Project Name</TableHead>
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
                      <TableCell className="font-medium">{project.name}</TableCell>
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

