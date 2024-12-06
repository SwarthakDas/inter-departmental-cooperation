"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Navbar from '@/components/Navbar'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date.",
  path: ["endDate"],
})

export default function ProjectRegistration() {
  const { toast } = useToast()
  const [showConflictDialog, setShowConflictDialog] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const {data:session}=useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const departmentCode=session?.user.departmentCode
        const response= await axios.post<ApiResponse>(`/api/project-conflict?departmentCode=${departmentCode}`,
            {
                "startDate": values.startDate,
                "endDate":values.endDate
            }
        )
        if(response.data.message==="No possible conflicts found"){
            await axios.post<ApiResponse>(`/api/project-registration?departmentCode=${departmentCode}`,values)
            toast({
                title: "Success",
                description: "Project registered successfully",
            })
        }
        else if(response.data.message==="Conflicts found"){
            setShowConflictDialog(true)
        }
    } catch (error) {
        console.error("Error Employee Registration",error)
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage= axiosError.response?.data.message
        toast({
            title: "Project Registration failed",
            description: errorMessage,
            variant: "destructive"
        })
    }
  }

  async function registerProject(values: z.infer<typeof formSchema>) {
    try {
        const departmentCode=session?.user.departmentCode
        await axios.post<ApiResponse>(`/api/project-registration?departmentCode=${departmentCode}`,values)
        await axios.post<ApiResponse>(`/api/register-conflict?departmentCode=${departmentCode}`,values)
        toast({
            title: "Success",
            description: "Project registered successfully",
        })
    } catch (error) {
        console.error("Error Employee Registration",error)
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage= axiosError.response?.data.message
        toast({
            title: "Project Registration failed",
            description: errorMessage,
            variant: "destructive"
        })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Navbar />
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Register Project</CardTitle>
            <CardDescription className="text-center">Register a new department project</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter project description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                              setStartDate(date||null)
                            }}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              !startDate || date < startDate || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Register Project</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conflict Detected</DialogTitle>
            <DialogDescription>
              This project conflicts with another project in this area. Do you still want to register it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConflictDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowConflictDialog(false)
              registerProject(form.getValues())
            }}>Register Anyway</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
