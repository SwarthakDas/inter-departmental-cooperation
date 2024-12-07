"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Skeleton } from '@/components/ui/skeleton'

// Mock data
// const inventoryItems = [
//   { id: 1, name: "Laptop", quantity: 50 },
//   { id: 2, name: "Desk", quantity: 100 },
//   { id: 3, name: "Chair", quantity: 100 },
//   { id: 4, name: "Projector", quantity: 10 },
//   { id: 5, name: "Whiteboard", quantity: 20 },
// ]

export default function InventoryPage() {
  const {data:session}=useSession()
  const [inventoryItems,setInventoryItems]=useState([{id:0,name:"",quantity:0}])
  const {toast}=useToast()

    const getInventory=useCallback(async()=>{
      try {
        const departmentName=session?.user.departmentName
        const response=await (await axios.get<ApiResponse>(`/api/get-inventory?departmentName=${departmentName}`)).data.inventory
        if (!response) {
          throw new Error("No Inventory data available");
        }
        setInventoryItems(
          response.map((inv, index) => ({
            id:index,
            name: inv["name"],
            quantity: Number(inv["count"])
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
        getInventory()
      },[session,getInventory])

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
            <CardTitle className="text-2xl font-bold">Inventory</CardTitle>
            <Link href="/dashboard/register-inventory">
              <Button>
                <Package className="mr-2 h-4 w-4" /> Register New Inventory
              </Button>
            </Link>
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
                {inventoryItems.map((item) => (
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

