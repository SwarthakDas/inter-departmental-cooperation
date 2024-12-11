"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Users, Check, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

const InvitationsPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const {toast}=useToast()
  const [pendingInvites,setPendingInvites]=useState<{id:number,type:string,fromDepartment:string,message:string,sentAt:Date,invitationId:string}[]>([])
  const [conferenceInvitations,setConferenceInvitations]=useState<{id:number,title:string,hostDepartment:string,startTime:Date,hostId:string}[]>([])
  const [selectedConference, setSelectedConference] = useState(conferenceInvitations[0])

  const handleAcceptInvite = async(inviteId) => {
    try {
      const response= await axios.get<ApiResponse>(`/api/accept-invitation?inviteId=${inviteId}`)
      if(!response)throw new Error("No response received");
      toast({
        title: "Invitation Accepted",
      });
      getConference()
      getInvites()
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

  const handleDeclineInvite = async(inviteId) => {
    try {
      const response= await axios.get<ApiResponse>(`/api/reject-invitation?inviteId=${inviteId}`)
      if(!response)throw new Error("No response received");
      toast({
        title: "Invitation Rejected",
      });
      getConference()
      getInvites()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "An error occurred";
      console.error("Error Rejecting invite", errorMessage);
      toast({
        title: "Error Rejecting invite",
        variant: "destructive",
      });
    }
  }

  const handleJoinConference = () => {
    router.replace(`/dashboard/video-conference/${selectedConference.hostId}`)
  }

  const getInvites=useCallback(async()=>{
    try {
      const departmentCode = session?.user.departmentCode;
      const response = await axios.get<ApiResponse>(`/api/get-invitations?departmentCode=${departmentCode}`);
      const invites=response.data.invites
      if(!invites)throw new Error("No invites received");
      const invitesArray=invites.map((invite,index)=>({
        id: index+1,
        type: invite["title"]||null,
        fromDepartment: invite["hostName"],
        message: invite["message"]||null,
        sentAt: invite["time"],
        invitationId: invite["invitationId"]
      }))
      setPendingInvites(invitesArray)
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

  const getConference=useCallback(async()=>{
    try {
      const departmentCode = session?.user.departmentCode;
      const response = await axios.get<ApiResponse>(`/api/get-accepted-invitations?departmentCode=${departmentCode}`);
      const conferences=response.data.invites
      if(!conferences)throw new Error("No invites received");
      const conferencesArray=conferences.map((conference,index)=>({
        id: index+1,
        title: conference["title"]||null,
        hostDepartment: conference["hostName"],
        startTime: conference["time"],
        hostId: conference["hostId"]
      }))
      setConferenceInvitations(conferencesArray)
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

  useEffect(()=>{
    if(!session||!session.user)return;
    getInvites()
    getConference()
  },[getInvites,session,getConference])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Invitations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {pendingInvites.map((invite) => (
                    <Card key={invite.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{invite.type}</h3>
                          <Badge variant="secondary">{invite.fromDepartment}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{invite.message}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Sent {new Date(invite.sentAt).toLocaleDateString()}
                          </span>
                          <div className="space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleAcceptInvite(invite.invitationId)}>
                              <Check className="mr-1 h-4 w-4" /> Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeclineInvite(invite.invitationId)}>
                              <X className="mr-1 h-4 w-4" /> Decline
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Conference Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {conferenceInvitations.map((conference) => (
                    <Card 
                      key={conference.id} 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedConference?.id === conference.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedConference(conference)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{conference.title}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Host: {conference.hostDepartment}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {new Date(conference.startTime).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
              {selectedConference && (
                <div className="mt-4 flex justify-center">
                  <Button onClick={handleJoinConference}>
                    Join Conference
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default InvitationsPage

