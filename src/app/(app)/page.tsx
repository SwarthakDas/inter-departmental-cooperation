"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Users, MessageCircle, Shield, Calendar, Truck, Brain, Video, Book, UserPlus, PhoneCall, Flame, Droplet,  Building } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import * as React from "react"
import { motion, useAnimation, useInView } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Navbar from '@/components/Navbar'


const features = [
  { name: "Real-time Communication", icon: MessageCircle, description: "Instant messaging and updates between departments." },
  { name: "Conflict Resolution", icon: Shield, description: "Efficiently resolve inter-departmental conflicts." },
  { name: "Project Calendar", icon: Calendar, description: "View and manage department projects to avoid clashes." },
  { name: "Resource Sharing", icon: Truck, description: "Request or offer resources to other departments." },
  { name: "Data Security", icon: Shield, description: "End-to-end encryption and robust data safety measures." },
  { name: "AI-driven Solutions", icon: Brain, description: "Leverage AI for smarter decision-making." },
  { name: "Video Conferencing", icon: Video, description: "Conduct online meetings and workshops." },
  { name: "Employee Exchange", icon: UserPlus, description: "Share workforce across departments as needed." },
  { name: "Emergency Contact", icon: PhoneCall, description: "Quick access to emergency contacts across departments." },
]

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let startTime: number
    let animationFrame: number
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      if (progress < duration) {
        setCount(Math.min(Math.floor((progress / duration) * end), end))
        animationFrame = requestAnimationFrame(updateCount)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count}</span>
}

function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    "/images/supremeCourt.jpg?height=500&width=1200",
    "/images/parliament.jpg?height=500&width=1200",
    "/images/redFort.jpg?height=500&width=1200",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative w-full h-[450px] overflow-hidden">
      {slides.map((slide, index) => (
        <Image
          key={index}
          src={slide}
          alt={`Department Building ${index + 1}`}
          width={500} height={500}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}



const departmentCategories = [
  {
    name: "Emergency Services",
    departments: [
      { name: "Fire Department", icon: Flame, color: "text-red-500", description: "Emergency fire response and prevention" },
      { name: "Police Department", icon: Shield, color: "text-blue-500", description: "Law enforcement and public safety" },
      { name: "Ambulance Services", icon: Truck, color: "text-green-500", description: "Emergency medical response" }
    ]
  },
  {
    name: "Public Utilities",
    departments: [
      { name: "Water Department", icon: Droplet, color: "text-blue-500", description: "Water supply and management" },
      { name: "Electricity Board", icon: Flame, color: "text-yellow-500", description: "Power supply and maintenance" },
      { name: "Waste Management", icon: Truck, color: "text-green-500", description: "City cleaning and waste disposal" }
    ]
  },
  {
    name: "Administration",
    departments: [
      { name: "Urban Planning", icon: Building, color: "text-purple-500", description: "City development and planning" },
      { name: "Revenue Department", icon: Building2, color: "text-gray-500", description: "Tax collection and management" },
      { name: "Municipal Corporation", icon: Building2, color: "text-blue-500", description: "City administration" }
    ]
  },
  {
    name: "Social Services",
    departments: [
      { name: "Education Department", icon: Book, color: "text-indigo-500", description: "Public education management" },
      { name: "Health Department", icon: Users, color: "text-pink-500", description: "Public health services" },
      { name: "Social Welfare", icon: Users, color: "text-orange-500", description: "Community support services" }
    ]
  }
]

function DepartmentSection() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {departmentCategories.map((category, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg mb-2">
            <AccordionTrigger className="px-4 py-2 hover:bg-gray-50 [&[data-state=open]]:bg-gray-50">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">{category.name}</span>
              </motion.div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-4">
              <div className="grid gap-4">
                {category.departments.map((dept, deptIndex) => (
                  <motion.div
                    key={deptIndex}
                    className="flex items-start gap-4 p-3 rounded-md hover:bg-gray-50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: deptIndex * 0.1 }}
                  >
                    <div className="shrink-0">
                      <dept.icon className={`h-6 w-6 ${dept.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{dept.name}</h4>
                      <p className="text-sm text-gray-600">{dept.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}


function AnimateInView({ children }) {
  const controls = useAnimation()
  const ref = React.useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.5 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main className="flex-1 pt-16">
        <section className="w-full relative">
        <Slideshow />
          <div className="absolute inset-0 bg-black bg-opacity-45 flex items-center justify-center">
            <motion.div
              className="text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6">
                Connecting City Departments Across India
              </h1>
              <p className="mx-auto max-w-[700px] text-xl mb-10">
                Streamline communication between vital city departments for faster response and better governance.
              </p>
              <div className="flex justify-center gap-7">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/sign-in">
                  <Button className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white h-16 w-48 text-lg flex items-center justify-center">
                    <Building2 className="mr-2 h-6 w-6" />
                    Department Login
                  </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/employee-sign-in">
                  <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600 h-16 w-48 text-lg flex items-center justify-center">
                    <Users className="mr-2 h-6 w-6" />
                    Employee Login
                  </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="w-full py-16 flex justify-center bg-zinc-100">
          <div className="container px-4 md:px-6">
            <AnimateInView>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Connected Departments</h2>
            </AnimateInView>
            <DepartmentSection />
          </div>
        </section>
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-100 flex justify-center">
          <div className="container px-4 md:px-6">
            <AnimateInView>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            </AnimateInView>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <AnimateInView key={index}>
                  <motion.div
                    className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-48"
                    whileHover={{ y: -5 }}
                  >
                    <feature.icon className="h-12 w-12 mb-4 text-blue-600" />
                    <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                </AnimateInView>
              ))}
            </div>
          </div>
        </section>
        <section className="flex justify-center w-full py-16 md:py-24 lg:py-32 bg-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <AnimateInView>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Impact</h2>
            </AnimateInView>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <AnimateInView>
                <div>
                  <p className="text-4xl font-bold mb-2"><AnimatedCounter end={50} /></p>
                  <p>Departments Connected</p>
                </div>
              </AnimateInView>
              <AnimateInView>
                <div>
                  <p className="text-4xl font-bold mb-2"><AnimatedCounter end={500} /></p>
                  <p>Conflicts Resolved</p>
                </div>
              </AnimateInView>
              <AnimateInView>
                <div>
                  <p className="text-4xl font-bold mb-2"><AnimatedCounter end={10000} /></p>
                  <p>Employees Engaged</p>
                </div>
              </AnimateInView>
              <AnimateInView>
                <div>
                  <p className="text-4xl font-bold mb-2"><AnimatedCounter end={1000} /></p>
                  <p>Projects Coordinated</p>
                </div>
              </AnimateInView>
            </div>
          </div>
        </section>
        <section className="flex justify-center w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <AnimateInView>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Transform Your City Communication?
                  </h2>
                  <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Join the CityConnect forum to collaborate, share ideas, and enhance your city&#39;s growth!
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex space-x-2" 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const emailInput = (e.target as HTMLFormElement).email.value;
                    const username = emailInput.split("@")[0];
                    window.location.href = `/discussion-forum/${username}`;
                  }}
                  >
                    <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" name='email' />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button type="submit">
                        Get Started
                      </Button>
                    </motion.div>
                  </form>
                  <p className="text-xs text-gray-500">
                    By signing up, you agree to our{" "}
                    <Link className="underline underline-offset-2 hover:text-gray-900" href="#">
                      Terms & Conditions
                    </Link>
                  </p>
                </div>
              </div>
            </AnimateInView>
          </div>
        </section>
      </main>
      <footer className="flex justify-center bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">Our Mission</Link></li>
                <li><Link href="#" className="hover:underline">Team</Link></li>
                <li><Link href="#" className="hover:underline">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">For Departments</Link></li>
                <li><Link href="#" className="hover:underline">For Employees</Link></li>
                <li><Link href="#" className="hover:underline">API Access</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">Documentation</Link></li>
                <li><Link href="#" className="hover:underline">Blog</Link></li>
                <li><Link href="#" className="hover:underline">Case Studies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">Support</Link></li>
                <li><Link href="#" className="hover:underline">Sales</Link></li>
                <li><Link href="#" className="hover:underline">Partnership</Link></li>
              </ul>
            </div>
          </div>
          <div  className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2024 CityConnect. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm hover:underline">Privacy Policy</Link>
              <Link href="#" className="text-sm hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}