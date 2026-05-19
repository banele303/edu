import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/AuthProvider";
import { useQuery, useMutation } from "convex/react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

import GeneratorControls, {
  type GenSettings,
} from "@/components/timetable/GeneratorControls";
import TimetableGrid from "@/components/timetable/TimetableGrid";

const Timetable = () => {
  const { user, year } = useAuth();
  const isStudent = user?.role === "student";
  const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";

  // Persist class selection in localStorage so it doesn't disappear on reload
  const [selectedClass, setSelectedClass] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("edunexus_selected_timetable_class") || "";
    }
    return "";
  });

  const handleClassSelect = (val: string) => {
    setSelectedClass(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("edunexus_selected_timetable_class", val);
    }
  };

  const classIdQuery = isStudent && user?.studentClass ? user.studentClass : selectedClass;
  const currentYearId = year?._id;

  // Timetable query
  const convexTimetable = useQuery(
    api.timetables.getTimetable,
    classIdQuery && currentYearId
      ? { classId: classIdQuery as any, academicYearId: currentYearId as any }
      : "skip"
  );
  
  // Context query for valid subjects and teachers in this class
  const contextData = useQuery(
    api.timetables.getGenerationContext,
    classIdQuery && currentYearId
      ? { classId: classIdQuery as any, academicYearId: currentYearId as any }
      : "skip"
  );

  const generateTimetableAction = useAction(api.timetables.generateTimetable);
  const saveTimetableMutation = useMutation(api.timetables.saveTimetable);
  const saveOverrideMutation = useMutation(api.timetables.saveOverride);
  const removeOverrideMutation = useMutation(api.timetables.removeOverride);

  const [isGenerating, setIsGenerating] = useState(false);

  const scheduleData = convexTimetable?.schedule || [];
  const overridesData = convexTimetable?.overrides || [];
  const loadingSchedule = convexTimetable === undefined && !!classIdQuery;

  const handleGenerate = async (
    selectedClass: string,
    yearId: string,
    settings: GenSettings
  ) => {
    try {
      setIsGenerating(true);
      toast.info("AI Generation Started...");
      await generateTimetableAction({
        classId: selectedClass as any,
        academicYearId: yearId as any,
        settings,
      });

      toast.success("Schedule generated successfully!");
      setIsGenerating(false);
    } catch (error: any) {
      toast.error(error.message || "Generation failed");
      setIsGenerating(false);
    }
  };

  const handleSaveSchedule = async (newSchedule: any[]) => {
    if (!classIdQuery || !currentYearId) return;
    try {
      // Map rich objects back to relational IDs for DB storage
      const cleanSchedule = newSchedule.map((day: any) => ({
        day: day.day,
        periods: (day.periods || []).map((period: any) => {
          if (period.isBreak || period.type === "break") {
            return {
              type: "break",
              isBreak: true,
              label: period.label || period.subject?.name || "Break",
              startTime: period.startTime,
              endTime: period.endTime,
            };
          }
          
          const subjectId = (period.subject && typeof period.subject === "object" && period.subject._id) 
            ? period.subject._id 
            : (typeof period.subject === "string" ? period.subject : undefined);

          const teacherId = (period.teacher && typeof period.teacher === "object" && period.teacher._id) 
            ? period.teacher._id 
            : (typeof period.teacher === "string" ? period.teacher : undefined);

          return {
            subject: subjectId,
            teacher: teacherId,
            startTime: period.startTime,
            endTime: period.endTime,
          };
        }),
      }));

      await saveTimetableMutation({
        classId: classIdQuery as any,
        academicYearId: currentYearId as any,
        schedule: cleanSchedule,
      });
      toast.success("Timetable updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save timetable");
    }
  };

  const handleSaveOverride = async (date: string, label: string, periods: any[]) => {
    if (!classIdQuery || !currentYearId) return;
    try {
      await saveOverrideMutation({
        classId: classIdQuery as any,
        academicYearId: currentYearId as any,
        date,
        label,
        periods,
      });
      toast.success(`Override saved for ${date}!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to save date override");
    }
  };

  const handleRemoveOverride = async (date: string) => {
    if (!classIdQuery || !currentYearId) return;
    try {
      await removeOverrideMutation({
        classId: classIdQuery as any,
        academicYearId: currentYearId as any,
        date,
      });
      toast.success(`Reset schedule for ${date} to standard!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset date override");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Timetable Management
        </h1>
        <p className="text-muted-foreground">
          {isStudent
            ? "View your weekly class schedule."
            : "View or manage weekly schedules."}
        </p>
      </div>
      {!isStudent && (
        <GeneratorControls
          onGenerate={handleGenerate}
          onClassChange={handleClassSelect}
          isGenerating={isGenerating}
          selectedClass={selectedClass}
          setSelectedClass={handleClassSelect}
        />
      )}
      <TimetableGrid 
        schedule={scheduleData as any} 
        overrides={overridesData as any}
        isLoading={loadingSchedule} 
        subjects={contextData?.subjects || []}
        teachers={contextData?.teachers || []}
        onSaveSchedule={handleSaveSchedule}
        onSaveOverride={handleSaveOverride}
        onRemoveOverride={handleRemoveOverride}
        editable={isAdminOrTeacher}
      />
    </div>
  );
};

export default Timetable;
