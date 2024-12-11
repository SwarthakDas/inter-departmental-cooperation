"use client"

import { useCallback, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useSession } from 'next-auth/react'

export default function DepartmentRequests() {
  const [requests,setRequests]=useState<{id:number,senderName:string,employeesRequested:Array<string>,inventoryRequested:{name:string,quantity:number}[],senderMessage:string,creationTime:string,status:string,requestId:string}[]>([])
  const [updatingDepartment, setUpdatingDepartment] = useState(false)
  const {toast}=useToast()
  const {data:session}=useSession()


  const getRequests=useCallback(async()=>{
    try {
      const departmentCode = session?.user.departmentCode;
      const response = await axios.get<ApiResponse>(`/api/get-requests?departmentCode=${departmentCode}`);
      const requests=response.data.requests
      if(!requests)throw new Error("No invites received");
      const requestsArray=requests.map((request,index)=>({
        id: index+1,
        senderName: request["senderName"]||null,
        employeesRequested: request["employeesRequested"],
        inventoryRequested: request["inventoryRequested"],
        senderMessage: request["senderMessage"]||null,
        creationTime: request["creationTime"],
        status: request["status"],
        requestId: request["requestId"]
      }))
      setRequests(requestsArray)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "An error occurred";
      console.error("Error fetching invites", errorMessage);
      toast({
        title: "Failed to fetch invites",
        variant: "destructive",
      });
    }
  },[toast,session])

  const handleAccept = async(id: string) => {
    try {
      const response= await axios.get<ApiResponse>(`/api/accept-request?requestId=${id}`)
      if(!response)throw new Error("No response received");
      toast({
        title: "Request Accepted",
      });
      getRequests()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "An error occurred";
      console.error("Error Accepting invite", errorMessage);
      toast({
        title: "Error Accepting invite",
        variant: "destructive",
      });
    }
  }

  const handleReject = async(id: string) => {
    try {
      const response= await axios.get<ApiResponse>(`/api/reject-request?requestId=${id}`)
      if(!response)throw new Error("No response received");
      toast({
        title: "Request Accepted",
      });
      getRequests()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "An error occurred";
      console.error("Error Accepting invite", errorMessage);
      toast({
        title: "Error Accepting invite",
        variant: "destructive",
      });
    }
  }

  const handleUpdateDepartment = (id: string) => {
    setUpdatingDepartment(true)
    console.log(id)
    // Simulate an API call to update department details
    setTimeout(() => {
      setUpdatingDepartment(false)
      toast({
        title: "Department Updated",
        description: "Department details have been updated successfully.",
      })
    }, 2000)
  }

  useEffect(()=>{
    if(!session||!session.user)return;
    getRequests()
  },[getRequests,session])


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 max-w-4xl pt-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Department Requests</h1>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            {requests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-800">{request.senderName}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Received: {new Date(request.creationTime).toLocaleString()}
                      </CardDescription>
                    </div>
                    {request.status && (
                      <Badge 
                        variant="outline" 
                        className={`${
                          request.status === 'accepted' 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'bg-red-100 text-red-800 border-red-300'
                        } text-xs font-semibold px-2 py-1 rounded-full`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="mb-4 text-gray-700">{request.senderMessage}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {request.employeesRequested.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h3 className="font-semibold text-sm text-gray-700 mb-2">Employees Requested:</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {request.employeesRequested.map((employee, index) => (
                            <li key={index}>{employee.split(",")[0].split(":")[1].trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {request.inventoryRequested.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h3 className="font-semibold text-sm text-gray-700 mb-2">Inventory Requested:</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {request.inventoryRequested.map((item, index) => (
                            <li key={index}>{item.name} (Quantity: {item.quantity})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-4">
                  {!request.status && (
                    <>
                      <Button onClick={() => handleReject(request.requestId)} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">Reject</Button>
                      <Button onClick={() => handleAccept(request.requestId)} variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">Accept</Button>
                    </>
                  )}
                  {request.status === 'accepted' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">Update Department</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white rounded-lg shadow-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-semibold text-gray-800">Update Department Details</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            This will update your department details based on the accepted request.
                            Are you sure you want to proceed?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex items-center space-x-2 my-4">
                          <Checkbox id="terms" className="text-blue-500 focus:ring-blue-500" />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I understand this action will modify department resources
                          </label>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-gray-500 hover:text-gray-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleUpdateDepartment(request.requestId)}
                            className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
                          >
                            {updatingDepartment ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                              </>
                            ) : (
                              "Update"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {request.status === 'rejected' && (
                    <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}

