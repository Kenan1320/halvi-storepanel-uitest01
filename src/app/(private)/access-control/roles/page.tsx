"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Column, DataTable } from "@/components/Tables/data-table";
import { ToastProvider } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Sample data for roles
const sampleData = [
  {
    id: 1,
    name: "Super Administrator",
  },
  {
    id: 2,
    name: "Administrator",
  },
  {
    id: 3,
    name: "Manager",
  },
  {
    id: 4,
    name: "Editor",
  },
  {
    id: 5,
    name: "Viewer",
  },
  {
    id: 6,
    name: "Customer Support",
  },
  {
    id: 7,
    name: "Content Creator",
  },
  {
    id: 8,
    name: "Analyst",
  },
];


const RolesPage = () => {
  const router = useRouter()

// Define columns
const columns: Column[] = [
  {
    key: "name",
    label: "Name",
    filterable: true,
    filterOptions: ["Super Administrator", "Administrator", "Manager", "Editor", "Viewer"],
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
            router.push("roles/edit")         
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
  const handleAddClick = () => {
    router.push("roles/create")
  };

  const handleRowClick = (item: any) => {
    toast({
      title: "Role Selected",
      description: `You clicked on ${item.name}`,
    });
  };

  return (
    <ToastProvider>
      <Breadcrumb pageName="Roles" />

      <DataTable
        type="Role"
        data={sampleData}
        columns={columns}
        onAddClick={handleAddClick}
        onRowClick={handleRowClick}
        pageSize={5}
      />
    </ToastProvider>
  );
};

export default RolesPage;