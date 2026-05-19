import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Button } from "@/components/ui/button";
// import Alert from "@/components/global/alert";
import AcademicYearTable from "@/components/academic-year/academic-year-table";
import Search from "@/components/global/Search";
import AcademicYearForm from "@/components/academic-year/AcademicYearForm";
import CustomAlert from "@/components/global/CustomAlert";

const AcademicYear = () => {
  const convexYears = useQuery(api.academicYears.getAcademicYears);
  
  // --- Search & Pagination State ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageNum, setPageNum] = useState(1);
  
  // Client-side filtering and pagination
  const filteredYears = convexYears?.filter(y => 
    y.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredYears.length / itemsPerPage));
  const currentYears = filteredYears.slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage);

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<any | null>(null);

  // Alert States
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNum(1); // Reset to first page on new search
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleCreate = () => {
    setEditingYear(null);
    setIsFormOpen(true);
  };

  const handleEdit = (year: any) => {
    setEditingYear(year);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsAlertOpen(true);
  };

  const deleteYearMutation = useMutation(api.academicYears.deleteYear);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteYearMutation({ id: deletingId as any });
      toast.success("Academic year deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setIsAlertOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Years</h1>
          <p className="text-muted-foreground">Manage school sessions.</p>
        </div>
        <div className="flex gap-3">
          <Search search={search} setSearch={setSearch} title="Academic Year" />
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add New Year
          </Button>
        </div>
      </div>
      {/* Table Component */}
      <AcademicYearTable
        data={currentYears as any}
        loading={convexYears === undefined}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        pageNum={pageNum}
        setPageNum={setPageNum}
        totalPages={totalPages}
      />
      <AcademicYearForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingYear}
        onSuccess={() => {}}
      />
      <CustomAlert
        handleDelete={confirmDelete}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        title="Delete Academic Year"
        description="Are you sure you want to delete this Academic Year? This action cannot be undone."
      />
    </div>
  );
};

export default AcademicYear;
