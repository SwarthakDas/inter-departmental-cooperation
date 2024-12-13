"use client"

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'


const employeeSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

const formSchema = z.object({
  employees: z.array(employeeSchema).min(1, {
    message: "Please add at least one employee.",
  }),
})

export default function EmployeeRegistration() {
    const {data: session}= useSession()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employees: [{ name: '', email: '', password: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "employees",
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        values.employees.map(async(employee)=>{
            const departmentCode=session?.user.departmentCode
            await axios.post<ApiResponse>(`/api/employee-register?departmentCode=${departmentCode}`,employee)
        })
        toast({
            title: "Success",
            description: "Employees registered successfully",
        })
    } catch (error) {
        console.error("Error Employee Registration",error)
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage= axiosError.response?.data.message
        toast({
            title: "Employee Registration failed",
            description: errorMessage,
            variant: "destructive"
        })
    }
    form.reset();
  }

  if(!session||!session.user){
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto py-10 px-4 mt-10 flex items-center min-h-screen">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <Skeleton className="h-6 w-2/3 mx-auto rounded-lg" />
              <Skeleton className="h-4 w-1/2 mx-auto mt-2 rounded-lg" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-1/4 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ))}
                <div className="flex justify-between items-center">
                  <Skeleton className="h-10 w-1/3 rounded-lg" />
                  <Skeleton className="h-10 w-1/3 rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 mt-10 flex items-center min-h-screen">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Register Employees</CardTitle>
            <CardDescription className="text-center">Add new employees to the department.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Employee {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`employees.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`employees.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`employees.${index}.password`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', email: '', password: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                  <Button type="submit">Register Employees</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

