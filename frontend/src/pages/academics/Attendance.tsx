import { useState } from "react";  
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const classes = useQuery(api.classes.getClasses, { academicYear: undefined });
  const attendance = useQuery(api.attendance.getAttendance, 
    selectedClassId ? { classId: selectedClassId as any, date: format(date, "yyyy-MM-dd") } : "skip"
  );
  const markAttendance = useMutation(api.attendance.markAttendance);

  const selectedClass = classes?.find(c => c._id === selectedClassId);

  const handleMark = async (studentId: string, status: "present" | "absent" | "late") => {
    try {
      await markAttendance({
        classId: selectedClassId as any,
        date: format(date, "yyyy-MM-dd"),
        records: [{ studentId: studentId as any, status }],
      });
      toast.success("Attendance updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to mark attendance");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Track daily student presence.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((c) => (
                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {!selectedClassId ? (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 space-y-2">
            <CalendarIcon className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground font-medium">Please select a class to view attendance.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Class List: {selectedClass?.name}</CardTitle>
            <CardDescription>Mark presence for {format(date, "PPPP")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedClass?.students?.map((student: any) => {
                  const record = attendance?.find(r => r.student === student._id);
                  return (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        {record ? (
                          <Badge variant={
                            record.status === "present" ? "success" : 
                            record.status === "absent" ? "destructive" : "warning"
                          }>
                            {record.status}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm italic">Not marked</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={() => handleMark(student._id, "present")}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => handleMark(student._id, "absent")}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-amber-600 hover:text-amber-700" onClick={() => handleMark(student._id, "late")}>
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
