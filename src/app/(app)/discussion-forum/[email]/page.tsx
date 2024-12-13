"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, MessageCircle, Plus, Reply } from 'lucide-react'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Reply {
  _id: string
  author: string
  content: string
  createdAt: string
}

interface Question {
  _id: string
  topic: string
  question: string
  author: string
  createdAt: string
  replies: Reply[]
}

export default function DiscussionForum() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState({ topic: '', question: '' })
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newReply, setNewReply] = useState('')
  const pathname = usePathname()
  const author = pathname.split('/').pop() || "unknown"

  const getDiscussions = async () => {
    try {
      const response = await axios.get<{ success: boolean; discussions: Question[] }>('/api/get-discussions')
      if (response.data.success) {
        setQuestions(response.data.discussions)
      } else {
        console.error("Failed to fetch discussions:", response.data)
      }
    } catch (error) {
      console.error("Error fetching discussions:", error)
    }
  }

  useEffect(() => {
    getDiscussions()
  }, [])

  const handleAskQuestion = async () => {
    if (newQuestion.topic && newQuestion.question) {
      const questionPayload = {
        ...newQuestion,
        author,
        createdAt: new Date().toISOString(),
      }
      await axios.post('/api/register-question', questionPayload)
      setNewQuestion({ topic: '', question: '' })
      setIsQuestionDialogOpen(false)
      getDiscussions()
    }
  }

  const handleAddReply = async (questionId: string) => {
    if (newReply) {
      const replyPayload = {
        questionId,
        author,
        content: newReply,
        createdAt: new Date().toISOString(),
      }
      await axios.post('/api/register-reply', replyPayload)
      setNewReply('')
      setReplyingTo(null)
      getDiscussions()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div>
          <motion.header
            className="px-4 lg:px-6 h-16 flex items-center fixed top-0 left-0 right-0 z-10 bg-white bg-opacity-90 backdrop-blur-md justify-between shadow-md"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}>
            <Link className="flex items-center justify-center" href="/">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CityConnect</span>
            </Link>
            <div className='flex items-center space-x-4'>
              <span className='text-sm font-medium'>Welcome, {author}</span>
              <Image height={60} width={60} src="/images/ashokStambh.png" alt='Ashok Stambh' />
            </div>
          </motion.header>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Discussion Forum</h2>
            <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Raise a Question
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Raise a New Question</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAskQuestion()
                  }}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Topic"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Your question"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    required
                  />
                  <Button type="submit">Submit Question</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {questions.map((q) => (
                <Card key={q._id}>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{q.topic}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{q.question}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MessageCircle className="mr-1 h-4 w-4" />
                      <span className="mr-2">Asked by {q.author}</span>
                      <span>{new Date(q.createdAt).toLocaleString()}</span>
                    </div>
                    {q.replies.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h3 className="font-semibold">Replies:</h3>
                        {q.replies.map((reply) => (
                          <div key={reply._id} className="pl-4 border-l-2 border-gray-200">
                            <p className="text-gray-700">{reply.content}</p>
                            <div className="text-sm text-gray-500">
                              <span className="mr-2">{reply.author} replied</span>
                              <span>{new Date(reply.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {replyingTo === q._id ? (
                      <div className="w-full space-y-2">
                        <Textarea
                          placeholder="Your reply"
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
                          <Button onClick={() => handleAddReply(q._id)}>Submit Reply</Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => setReplyingTo(q._id)}>
                        <Reply className="mr-2 h-4 w-4" /> Reply
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  )
}
