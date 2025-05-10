"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RoleManagementForm from "@/components/role-management-form";
import { Column, DataTable } from "@/components/Tables/data-table";
import { ToastProvider } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { Edit2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";


const RolesPage = () => {
  const [isCreating, setIsCreating] = useState(false)
  function handleCreateRole(data: any): any {
    console.log("data",data)
  }
  return (
    <ToastProvider>
      <Breadcrumb pageName="Create New Role" />

      <RoleManagementForm/>
    </ToastProvider>
  );
};

export default RolesPage;