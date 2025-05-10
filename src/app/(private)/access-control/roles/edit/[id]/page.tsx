"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RoleManagementForm from "@/components/role-management-form";
import { ToastProvider } from "@/components/ui/toast";
import { useParams } from "next/navigation";

const RolesPage = () => {
  const params = useParams();
  const roleId = params?.id ? Number(params.id) : undefined;

  return (
    <ToastProvider>
      <Breadcrumb pageName={"Update Role"} />
      <RoleManagementForm roleId={roleId} />
    </ToastProvider>
  );
};

export default RolesPage;