"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  toDepartment: z.string({
    required_error: "Please select a department.",
  }),
  employeeMail: z.array(z.string()).min(0, "Select at least one employee."),
  tools: z.array(z.string()).min(0, "Select at least one inventory item."),
  content: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function SendRequest() {
  const { toast } = useToast();
  const [openDepartment, setOpenDepartment] = useState(false);
  const [openEmployees, setOpenEmployees] = useState(false);
  const [openInventory, setOpenInventory] = useState(false);
  const [toDepartment,setToDepartment]=useState("")
  const [departments,setDepartments]=useState([{value:"",label:""}])
  const [employees,setEmployees] = useState([{value:"",label:""}])
  const [inventoryItems,setInventoryItems]=useState([{value:"",label:"",maxCount:0}])
  const [hasFetchedDepartments, setHasFetchedDepartments] = useState(false);
  const {data: session}=useSession()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toDepartment: "",
      employeeMail: [],
      tools: [],
      content: "",
    },
  });
  const router=useRouter()

  useEffect(()=>{
    const getDepartments=async()=>{
      if(departments){
        try {
          const response=await (await axios.get(`/api/get-departments`)).data.departmentNames
          setDepartments(response.map((dept) => ({
            value: dept.toLowerCase().replace(/\s+/g, "-"),
            label: dept,
          })))
          setHasFetchedDepartments(true)
        } catch (error) {
          const axiosError=error as AxiosError<ApiResponse>
          console.log(axiosError)
          toast({
            title:"Error fetching departments",
            variant: "destructive",
          })
        }
      }
      
  }
  if(!hasFetchedDepartments)getDepartments();
  },[toast,hasFetchedDepartments,departments])

  const getEmployees=useCallback(async()=>{
      try {
        const response=await (await axios.get<ApiResponse>(`/api/get-employees-for-request?departmentName=${toDepartment}`)).data.employees
        if (!response) {
          throw new Error("No employees data available");
        }
        setEmployees(
          response.map((emp) => ({
            value: emp.split(",")[1].split(":")[1].trim(),
            label: emp.split(",")[0].split(":")[1].trim(),
          }))
        )
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        const errorMessage=axiosError.response?.data.message
        console.log("Error fetching employees",errorMessage)
        toast({
          title:"Employees fetching failed",
          variant: "destructive"
        })
      }
},[toast,toDepartment])
  
const getInventory=useCallback(async()=>{
      try {
        const response=await (await axios.get<ApiResponse>(`/api/get-inventory?departmentName=${toDepartment}`)).data.inventory
        if (!response) {
          throw new Error("No Inventory data available");
        }
        setInventoryItems(
          response.map((inv, index) => ({
            value: `${inv["name"].toLowerCase().replace(/\s+/g, "-")}-${index}`,
            label: inv["name"],
            maxCount: Number(inv["count"])
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
},[toast,toDepartment])

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      const departmentCode=session?.user.departmentCode
      const response= await axios.post<ApiResponse>(`/api/send-request?departmentCode=${departmentCode}`,values)
      toast({
        title: "Request sent successfully",
        description: response.data.message
      })
      console.log(values);
      router.replace(`/dashboard`)
    } catch (error) {
      console.error("Error Department sign up",error)
      const axiosError=error as AxiosError<ApiResponse>
      const errorMessage= axiosError.response?.data.message
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
  };

  useEffect(()=>{
    if(!session || !session.user) return
    if(toDepartment)getEmployees()
    if(toDepartment)getInventory()
  },[session,getEmployees,toDepartment,getInventory])

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-6 mt-40">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" /> 
          <Skeleton className="h-12 w-full rounded-lg" /> 
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-6 w-1/3 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />
        </div>
        <Skeleton className="h-8 w-1/2 rounded-lg" />
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Navbar />
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Send Request</CardTitle>
            <CardDescription className="text-center">Request resources from other departments</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="toDepartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Department</FormLabel>
                    <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {field.value
                            ? departments.find((dep) => dep.label === field.value)?.label
                            : "Select department..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search departments..." />
                          <CommandList>
                            {departments.map((department) => (
                              <CommandItem
                                key={department.value}
                                onSelect={() => {
                                  field.onChange(department.label);
                                  setToDepartment(department.label); // Update toDepartment with the label
                                  setOpenDepartment(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === department.label ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {department.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="employeeMail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employees</FormLabel>
                      <Popover open={openEmployees} onOpenChange={setOpenEmployees}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {field.value?.length
                              ? `${field.value.length} employees selected`
                              : "Select employees..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search employees..." />
                            <CommandList>
                              {employees.map((emp) => (
                                <CommandItem
                                  key={emp.value}
                                  onSelect={() => {
                                    const current = new Set(field.value || []);
                                    if (current.has(emp.value)) {
                                      current.delete(emp.value);
                                    } else {
                                      current.add(emp.value);
                                    }
                                    field.onChange(Array.from(current));
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value?.includes(emp.value) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {emp.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory Items</FormLabel>
                      <Popover open={openInventory} onOpenChange={setOpenInventory}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value?.length
                                ? `${field.value.length} items selected`
                                : "Select inventory items..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search inventory..." />
                            <CommandList>
                              {inventoryItems.map((item) => {
                                const selectedCount = field.value?.filter(
                                  (selectedItem) => selectedItem === item.label
                                ).length || 0
                                return (
                                  <CommandItem
                                    key={item.value}
                                    onSelect={() => {
                                      if (selectedCount < item.maxCount) {
                                        field.onChange([...(field.value || []), item.label])
                                      }
                                    }}
                                  >
                                    <div className="flex items-center w-full">
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedCount > 0 ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <span>{item.label}</span>
                                      <div className="ml-auto flex items-center space-x-2">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className={cn(
                                            "h-8 w-8",
                                            selectedCount === 0 && "opacity-50"
                                          )}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            if (selectedCount > 0) {
                                              const current = [...(field.value || [])]
                                              const index = current.indexOf(item.label)
                                              if (index > -1) current.splice(index, 1) // Remove one instance
                                              field.onChange(current)
                                            }
                                          }}
                                          disabled={selectedCount === 0}
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-9 text-center text-sm">
                                          {selectedCount}/{item.maxCount}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className={cn(
                                            "h-8 w-8",
                                            selectedCount === item.maxCount && "opacity-50"
                                          )}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            if (selectedCount < item.maxCount) {
                                              field.onChange([...(field.value || []), item.label])
                                            }
                                          }}
                                          disabled={selectedCount === item.maxCount}
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CommandItem>
                                )
                              })}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="w-full h-32 p-2 border rounded"
                          placeholder="Enter your message here..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Send Request
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
