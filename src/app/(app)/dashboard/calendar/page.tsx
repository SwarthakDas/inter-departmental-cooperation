"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './calendar.css'
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Skeleton } from "@/components/ui/skeleton";

const localizer = momentLocalizer(moment);

type Event = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  department: string;
  allDay?: boolean;
  isMeeting?: boolean;
  isConflicting?: boolean;
};


const meetings: Event[] = [
  { id: 1, title: "Budget Meeting", start: new Date(2025, 5, 15), end: new Date(2025, 5, 15), department: "Urban Planning" },
  { id: 2, title: "Project Review", start: new Date(2025, 6, 1), end: new Date(2025, 6, 1), department: "Urban Planning" },
];


export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const {data:session}=useSession()
    const {toast}=useToast()
    const [departmentProjects,setDepartmentProjects]=useState([{id:-1,title:"",department:"",start:new Date(2025, 1, 1),end:new Date(2025, 3, 1)}])
    const [conflictingProjects,setConflictingProjects]=useState([{id:0,title:"",department:"",start:new Date(2025, 1, 1),end:new Date(2025, 3, 1)}])
    const [otherDepartmentProjects,setOtherDepartmentProjects]=useState([{id:-10,title:"",department:"",start:new Date(2025, 1, 1),end:new Date(2025, 3, 1)}])
    const [tempLength,setTempLength]=useState(0)
    const [date, setDate] = useState(new Date())
    const [view, setView] = useState('month');

    const handleViewChange = (newView) => {
      setView(newView);
    };
    const handleNavigate = (newDate) => {
      setDate(newDate)
    }

    const EventComponent = ({ event }: { event: Event }) => {
        let backgroundColor = "#3498db"; // Default color for department projects
        if (event.department !== session?.user.departmentName?.toString()) {
          backgroundColor = "#95a5a6"; // Color for other department projects
        }
        if (event.isConflicting) {
          backgroundColor = "#e74c3c"; // Color for conflicting projects
        }
        if (moment(event.end).isBefore(moment())) {
          backgroundColor = "#34495e"; // Color for past projects
        }
        if (event.isMeeting) {
          backgroundColor = "#2ecc71"; // Color for meetings
        }
      
        return (
          <div style={{ backgroundColor, color: "white", padding: "2px 5px", borderRadius: "3px" }}>
            {event.title}
          </div>
        );
      };

      const getDepartmentProjects = useCallback(async () => {
        try {
          const departmentCode = session?.user.departmentCode;
          if (!departmentCode) return;
      
          const response = await axios.get<ApiResponse>(
            `/api/get-projects?departmentCode=${departmentCode}`
          );
      
          const projectData = response.data.projects;
          if (!projectData) {
            throw new Error("No Inventory data available");
          }
          const departmentProjectsTemp: Event[] = [];
          const conflictingProjectsTemp: Event[] = [];
          setTempLength(projectData.length)
          for (let idx=0;idx<projectData.length;idx++) {
            const proj=projectData[idx]
            const conflictCheck = await axios.post<ApiResponse>(
              `/api/project-conflict?departmentCode=${departmentCode}`,
              {
                startDate: proj["startDate"],
                endDate: proj["endDate"],
              }
            );
      
            const project = {
              id: idx,
              title: proj["title"]||"null",
              start: new Date(proj["startDate"]),
              end: new Date(proj["endDate"]),
              department: session?.user.departmentName || "",
              isConflicting: false
            };
      
            if (conflictCheck.data.message === "No possible conflicts found") {
              departmentProjectsTemp.push(project);
            } else if (conflictCheck.data.message === "Conflicts found") {
                project.isConflicting=true;
              conflictingProjectsTemp.push(project);
            }
          }
          setDepartmentProjects(departmentProjectsTemp);
          setConflictingProjects(conflictingProjectsTemp);
          
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          const errorMessage = axiosError.response?.data.message || "Unknown error";
          console.error("Error fetching projects", errorMessage);
          toast({
            title: "projects fetching failed",
            variant: "destructive",
          });
        }
      }, [session, toast]);

      const getOtherDepartmentProjects=useCallback(async()=>{
        try {
          const departmentCode=session?.user.departmentCode
          const response=await (await axios.get<ApiResponse>(`/api/other-department-projects?departmentCode=${departmentCode}`)).data.projects
          if (!response) {
            throw new Error("No Inventory data available");
          }
          setOtherDepartmentProjects(
            response.map((proj, index) => ({
                id: index+tempLength+1,
                title: proj["title"]||"null",
                start: new Date(proj["startDate"]),
                end: new Date(proj["endDate"]),
                department: proj["departmentName"],
            }))
          )
        } catch (error) {
          const axiosError=error as AxiosError<ApiResponse>
          const errorMessage=axiosError.response?.data.message
          console.log("Error fetching other department projects",errorMessage)
          toast({
            title:"Inventory fetching  other department projects",
            variant: "destructive"
          })
        }
  },[toast,session,tempLength])
      

  useEffect(() => {
    const allEvents: Event[] = [
      ...departmentProjects.map(project => ({
        ...project,
        allDay: true,
      })),
      ...otherDepartmentProjects.map(project => ({
        ...project,
        allDay: true,
      })),
      ...meetings.map(meeting => ({
        ...meeting,
        allDay: false,
        isMeeting: true,
      })),
      ...conflictingProjects.map(project => ({
        ...project,
        allDay: true,
      })),
    ];
    setEvents(allEvents);
  }, [departmentProjects,conflictingProjects,otherDepartmentProjects]);

  const upcomingEvents = events
    .filter((event) => moment(event.start).isBetween(moment(), moment().add(30, "days")))
    .sort((a, b) => moment(a.start).diff(moment(b.start)));

    useEffect(()=>{
      if(!session || !session.user) return
      getDepartmentProjects()
      getOtherDepartmentProjects()
    },[session,getDepartmentProjects,getOtherDepartmentProjects])

    if(!session||!session.user){
        return (
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto py-10 px-4 pt-20">
              <div className="space-y-6">
                <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-1/2 rounded-lg" />
                  <div className="space-y-2">
                    {[...Array(5)].map((_, idx) => (
                      <Skeleton key={idx} className="h-6 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        )
    }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Department Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                components={{
                  event: EventComponent,
                }}
                date={date}
                onNavigate={handleNavigate}
                views={['month', 'week', 'day', 'agenda']}
                defaultView="month"
                onView={handleViewChange}
                view={view}
              />
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <li key={event.id} className="text-sm">
                      <span className="font-medium">{event.title}</span>
                      <br />
                      {moment(event.start).format("MMM D, YYYY")}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Color Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Badge className="bg-[#3498db] mr-2" />
                    <span>Department Projects</span>
                  </li>
                  <li className="flex items-center">
                    <Badge className="bg-[#95a5a6] mr-2" />
                    <span>Other Department Projects</span>
                  </li>
                  <li className="flex items-center">
                    <Badge className="bg-[#e74c3c] mr-2" />
                    <span>Conflicting Projects</span>
                  </li>
                  <li className="flex items-center">
                    <Badge className="bg-[#34495e] mr-2" />
                    <span>Past Projects</span>
                  </li>
                  <li className="flex items-center">
                    <Badge className="bg-[#2ecc71] mr-2" />
                    <span>Meetings</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}