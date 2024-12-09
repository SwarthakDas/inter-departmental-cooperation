"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";

export default function CommunicationPage() {
  const [contacts, setContacts] = useState<{ id: number; name: string; departmentName:string; messages: any[] }[]>([]);
  const [selectedContact, setSelectedContact] = useState<{ id: number; name: string; departmentName:string; messages: any[] } | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { data: session } = useSession();
  const { toast } = useToast();

  const otherDepartments = useCallback(async () => {
    try {
      const departmentCode = session?.user.departmentCode;
      const response = await axios.get<ApiResponse>(`/api/get-messages?departmentCode=${departmentCode}`);
      const allMessages = response.data.receivedMessages;

      if (!allMessages || allMessages.length === 0) {
        throw new Error("No messages data available");
      }
      
      const formattedContacts = await Promise.all(
        allMessages.map(async (dept, index) => {
          try {
            const response = await axios.get(`/api/get-department-details?departmentCode=${dept["departmentCode"]}`);
            const departmentName = response.data["departmentName"];
            console.log(departmentName)
            return {
              id: index,
              name: dept["departmentCode"],
              departmentName: departmentName || "Unknown",
              messages: dept["messages"],
            };
          } catch (error) {
            console.error(`Failed to fetch name for department ${dept["departmentCode"]}:`, error);
            return {
              id: index,
              name: dept["departmentCode"],
              departmentName: "Unknown",
              messages: dept["messages"],
            };
          }
        })
      );
      setContacts(formattedContacts);
      if (formattedContacts.length > 0) {
        setSelectedContact(formattedContacts[0]);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "An error occurred";
      console.error("Error fetching employees", errorMessage);
      toast({
        title: "Failed to fetch departments",
        variant: "destructive",
      });
    }
  }, [session, toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    otherDepartments();
    const intervalId = setInterval(() => {
      otherDepartments();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [session, otherDepartments]);
  

  const handleSendMessage = async(e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (newMessage.trim() && selectedContact) {
          const departmentCode = session?.user.departmentCode;
          const value={message:newMessage,toDepartmentCode:selectedContact.name} as object
          console.log(value)
          await axios.post<ApiResponse>(`/api/send-message?departmentCode=${departmentCode}`,value);
          setNewMessage("");
          otherDepartments();
      }
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
          const errorMessage=axiosError.response?.data.message
          console.log("Error sending message",errorMessage)
          toast({
            title:"Error sending message",
            variant: "destructive"
          })
    }
    
};


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Communication Center</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Contacts Section */}
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Contacts</h2>
              <ScrollArea className="h-[calc(100vh-250px)]">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${
                      selectedContact?.id === contact.id ? "bg-blue-100" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar>
                      <AvatarImage alt={contact.name} />
                      <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{contact.departmentName}</span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          {/* Messages Section */}
          <Card className="md:col-span-3">
            <CardContent className="p-4">
              {selectedContact ? (
                <>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage alt={selectedContact.name} />
                      <AvatarFallback>{selectedContact.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{selectedContact.departmentName}</h2>
                  </div>
                  <ScrollArea className="h-[calc(100vh-350px)] mb-4">
                    <div className="space-y-4">
                      {selectedContact.messages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex ${message.messageType === "sent" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.messageType === "sent" ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                          >
                            <p>{message.message}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow"
                    />
                    <Button type="submit">Send</Button>
                  </form>
                </>
              ) : (
                <p className="text-gray-500">Select a contact to view messages</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
