import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {AlertCircle, Calendar, Package, Users, FileText, Bell, Inbox, Menu, MessageSquare } from 'lucide-react'

const menuItems = [
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: AlertCircle, label: 'Conflicts', href: '/dashboard/conflicts', alert: true },
  { icon: MessageSquare, label: 'Communication Center', href: '/dashboard/communicate' },
  { icon: Users, label: 'Employees', href: '/dashboard/employees' },
  { icon: Package, label: 'Inventory', href: '/dashboard/inventory' },
  { icon: FileText, label: 'Projects', href: '/dashboard/projects' },
  { icon: Bell, label: 'Pending Invites', href: '/pending-invites', alert: true },
  { icon: Inbox, label: 'Pending Requests', href: '/pending-requests', alert: true },
]

export function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-[88px] left-6">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-1 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
              {item.label}
              {item.alert && (
                <span className="ml-auto h-2 w-2 rounded-full bg-red-400"></span>
              )}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

