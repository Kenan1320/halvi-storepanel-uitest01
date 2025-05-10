"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Column, DataTable } from "@/components/Tables/data-table";
import { ToastProvider } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Sample data for admin users
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Super Staffistrator",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Staffistrator",
    status: "Active",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "Editor",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.w@example.com",
    role: "Viewer",
    status: "Active",
  },
  {
    id: 6,
    name: "Sarah Brown",
    email: "sarah.b@example.com",
    role: "Customer Support",
    status: "Active",
  },
  {
    id: 7,
    name: "David Taylor",
    email: "david.t@example.com",
    role: "Content Creator",
    status: "Inactive",
  },
  {
    id: 8,
    name: "Jessica Lee",
    email: "jessica.l@example.com",
    role: "Analyst",
    status: "Active",
  },
];

// Define columns
const columns: Column[] = [
  {
    key: "name",
    label: "Name",
    filterable: true,
    filterOptions: ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis"],
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
    filterable: true,
    filterOptions: ["Super Staffistrator", "Staffistrator", "Manager", "Editor", "Viewer"],
    render: (value) => <Badge variant="outline">{value}</Badge>,
  },
  {
    key: "actions",
    label: "Actions",
    render: () => (
      <div className="flex gap-2">
        <button 
          className="text-blue-500 hover:text-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            toast({ title: "Edit clicked", description: "Edit action triggered" });
          }}
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button 
          className="text-red-500 hover:text-red-700"
          onClick={(e) => {
            e.stopPropagation();
            toast({ title: "Delete clicked", description: "Delete action triggered" });
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
];

const StaffUserPage = () => {
  const router = useRouter();
  const handleAddClick = () => {
    router.push("staff/create")
  };

  const handleRowClick = (item: any) => {
    toast({
      title: "Staff User Selected",
      description: `You clicked on ${item.name}`,
    });
  };

  return (
    <ToastProvider>
      <Breadcrumb pageName="Staff" />

      <DataTable
        type="Staff"
        data={sampleData}
        columns={columns}
        onAddClick={handleAddClick}
        onRowClick={handleRowClick}
        pageSize={5}
      />
    </ToastProvider>
  );
};

export default StaffUserPage;