"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navbar from '@/components/Navbar'

// Mock data for contacts
const contacts = [
  { id: 1, name: "Transportation Dept", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Environmental Dept", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Finance Dept", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "Parks & Recreation", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "Public Works", avatar: "/placeholder.svg?height=40&width=40" },
]

// Mock data for messages
const initialMessages = [
  { id: 1, senderId: 1, text: "Hello, how can we help you today?", timestamp: "2023-06-10T10:30:00Z" },
  { id: 2, senderId: 0, text: "Hi, I need information about the new traffic regulations.", timestamp: "2023-06-10T10:32:00Z" },
  { id: 3, senderId: 1, text: "I'll send you the latest document right away.", timestamp: "2023-06-10T10:35:00Z" },
]

export default function CommunicationPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        senderId: 0, // 0 represents the current user
        text: newMessage,
        timestamp: new Date().toISOString(),
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Communication Center</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Contacts</h2>
              <ScrollArea className="h-[calc(100vh-250px)]">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${
                      selectedContact.id === contact.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{contact.name}</span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{selectedContact.name}</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-350px)] mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderId === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

