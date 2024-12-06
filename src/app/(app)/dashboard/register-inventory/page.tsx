"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

const inventorySchema = z.object({
  content: z.string().min(2, {
    message: "Inventory name must be at least 2 characters.",
  }),
  count: z.number().min(1, {
    message: "Count must be at least 1.",
  }),
});

const formSchema = z.object({
  inventories: z.array(inventorySchema).min(1, {
    message: "Please add at least one inventory item.",
  }),
});

export default function InventoryRegistration() {
  const {data:session}=useSession()
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inventories: [{ content: "", count: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inventories",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      values.inventories.map(async(inventory)=>{
        const departmentCode=session?.user.departmentCode
        await axios.post<ApiResponse>(`/api/inventory-register?departmentCode=${departmentCode}`,inventory)
      })
      toast({
        title: "Success",
        description: "Inventory registered successfully",
    })
    } catch (error) {
      console.error("Error Employee Registration",error)
      const axiosError=error as AxiosError<ApiResponse>
      const errorMessage= axiosError.response?.data.message
      toast({
          title: "Inventory registration failed",
          description: errorMessage,
          variant: "destructive"
      })
    }
    setIsSubmitting(false);
    form.reset();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 mt-14">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Register Inventory
            </CardTitle>
            <CardDescription className="text-center">
              Add new inventory items to your department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Inventory {index + 1}</h4>
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
                    <FormField
                      control={form.control}
                      name={`inventories.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inventory Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter inventory name" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of the inventory item you want to register.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`inventories.${index}.count`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Count</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter count"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              min={1}
                            />
                          </FormControl>
                          <FormDescription>
                            The number of items you want to register.
                          </FormDescription>
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
                    onClick={() =>
                      append({ content: "", count: 1 })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Inventory
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register Inventories"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
