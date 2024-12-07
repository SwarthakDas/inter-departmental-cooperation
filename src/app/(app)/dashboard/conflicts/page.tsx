"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from 'lucide-react'
import Navbar from '@/components/Navbar'

// Mock data
const conflicts = [
  { id: 1, title: "Budget Allocation Dispute", department: "Finance" },
  { id: 2, title: "Project Timeline Disagreement", department: "Urban Planning" },
  { id: 3, title: "Resource Allocation Conflict", department: "Parks and Recreation" },
  { id: 4, title: "Policy Implementation Issue", department: "Legal" },
  { id: 5, title: "Interdepartmental Communication Breakdown", department: "Human Resources" },
]

export default function ConflictsPage() {
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
                      <span className="font-semibold">{conflict.title}</span>
                      <span className="text-sm text-gray-500">with {conflict.department} Department</span>
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

