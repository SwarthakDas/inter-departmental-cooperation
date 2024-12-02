import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Home, AlertCircle, Calendar, Package, Users, FileText, Bell, Inbox, Menu } from 'lucide-react'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/department-dashboard' },
  { icon: AlertCircle, label: 'Conflicts', href: '/conflicts', alert: true },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Package, label: 'Resources', href: '/resource-request' },
  { icon: Users, label: 'Employees', href: '/employee-registration' },
  { icon: Package, label: 'Inventory', href: '/inventory-registration' },
  { icon: FileText, label: 'Projects', href: '/project-registration' },
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
