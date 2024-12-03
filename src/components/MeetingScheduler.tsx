"use client"

import * as React from "react"
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"



const formSchema = z.object({
  meetingDateTime: z.date({
    required_error: "A date and time is required.",
  }),
  invitedDepartments: z.array(z.string()).min(1, "At least one department must be invited."),
})

export function MeetingScheduler({ meetingDept = [] }: { meetingDept?: string[] }) {
  const departments = meetingDept.map((dept) => ({
    value: dept.toLowerCase().replace(/\s+/g, "-"),
    label: dept,
  }));
  const [open, setOpen] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meetingDateTime: new Date() as Date,
      invitedDepartments: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="absolute top-[88px] right-8">Schedule a Meeting</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="meetingDateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Meeting Date and Time</FormLabel>
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
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Pick a date and time</span>
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
                        initialFocus
                      />
                      <div className="p-3 border-t">
                        <input
                          type="time"
                          className="w-full p-2 border rounded"
                          onChange={(e) => {
                            const date = field.value || new Date()
                            const [hours, minutes] = e.target.value.split(':')
                            date.setHours(parseInt(hours), parseInt(minutes))
                            field.onChange(date)
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="invitedDepartments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invite Departments</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value && field.value.length > 0
                          ? field.value.length === 1
                            ? departments.find(dept => dept.value === field.value[0])?.label
                            : `${field.value.length} departments selected`
                          : "Select departments..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search departments..." />
                        <CommandList>
                          <CommandEmpty>No department found.</CommandEmpty>
                          <CommandGroup>
                            {departments.map((department) => (
                              <CommandItem
                                key={department.value}
                                value={department.value}
                                onSelect={() => {
                                  const current = new Set(field.value || [])
                                  if (current.has(department.value)) {
                                    current.delete(department.value)
                                  } else {
                                    current.add(department.value)
                                  }
                                  field.onChange(Array.from(current))
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(department.value) 
                                      ? "opacity-100" 
                                      : "opacity-0"
                                  )}
                                />
                                {department.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Schedule Meeting</Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

