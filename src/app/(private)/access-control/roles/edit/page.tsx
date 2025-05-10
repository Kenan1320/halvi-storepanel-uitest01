"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RoleManagementForm from "@/components/role-management-form";
import { Column, DataTable } from "@/components/Tables/data-table";
import { ToastProvider } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { Edit2, Trash2 } from "lucide-react";


const RolesPage = () => {

  return (
    <ToastProvider>
      <Breadcrumb pageName="Update Role" />

      {/* <RoleManagementForm 
  initialData={roleData}
  onSave={handleUpdateRole}
  isSubmitting={isUpdating}
/> */}
    </ToastProvider>
  );
};

export default RolesPage;