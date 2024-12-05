"use client";

import { useState } from "react";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const departments = [
  { value: "urban-planning", label: "Urban Planning" },
  { value: "transportation", label: "Transportation" },
  { value: "environmental", label: "Environmental Protection" },
];

const employees = [
  { value: "john.doe@cityconnect.gov", label: "John Doe" },
  { value: "jane.smith@cityconnect.gov", label: "Jane Smith" },
  { value: "bob.johnson@cityconnect.gov", label: "Bob Johnson" },
];

const inventoryItems = [
  { value: "laptop", label: "Laptop", maxCount: 50 },
  { value: "desk", label: "Desk", maxCount: 100 },
  { value: "chair", label: "Chair", maxCount: 200 },
];

const formSchema = z.object({
  toDepartment: z.string({
    required_error: "Please select a department.",
  }),
  employees: z.array(z.string()).min(0, "Select at least one employee."),
  inventory: z.array(z.string()).min(0, "Select at least one inventory item."),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function SendRequest() {
  const { toast } = useToast();
  const [openDepartment, setOpenDepartment] = useState(false);
  const [openEmployees, setOpenEmployees] = useState(false);
  const [openInventory, setOpenInventory] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toDepartment: "",
      employees: [],
      inventory: [],
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast({
      title: "Request sent successfully",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
    console.log(values);
  };

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
                            ? departments.find((dep) => dep.value === field.value)?.label
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
                                    field.onChange(department.value); // Single selection
                                    setOpenDepartment(false); // Close popover after selection
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === department.value ? "opacity-100" : "opacity-0"
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
                  name="employees"
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
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory Items</FormLabel>
                      <Popover open={openInventory} onOpenChange={setOpenInventory}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {field.value?.length
                              ? `${field.value.length} items selected`
                              : "Select inventory items..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search inventory..." />
                            <CommandList>
                              {inventoryItems.map((item) => (
                                <CommandItem
                                  key={item.value}
                                  onSelect={() => {
                                    const current = new Set(field.value || []);
                                    if (current.has(item.value)) {
                                      current.delete(item.value);
                                    } else {
                                      current.add(item.value);
                                    }
                                    field.onChange(Array.from(current));
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value?.includes(item.value) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {item.label}
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
                  name="message"
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
