"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Column, DataTable } from "@/components/Tables/data-table";
import { ToastProvider } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { deleteRole, getAllRoles, loading, resetRoleState, roles,error } from "@/store/slices/role-slice";

const RolesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get data from Redux store
  const rolesData = useSelector(roles);
  const isLoading = useSelector(loading);
  const errorMessage = useSelector(error);

  // Define columns
  const columns: Column[] = [
    {
      key: "name",
      label: "Name",
      filterable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => {
        console.log("itemssky",item)
        return (
        <div className="flex gap-2">
          <button 
            className="text-blue-500 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              console.log("item",item)
              router.push(`roles/edit/${item.id}`);         
            }}
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )},
    },
  ];

  // Fetch roles on component mount
  useEffect(() => {
    dispatch(getAllRoles({ page: 1, limit: 10 })); // Adjust pagination as needed
    
    return () => {
      dispatch(resetRoleState());
    };
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteRole(id)).unwrap();
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      // Refresh the roles list
      dispatch(getAllRoles({ page: 1, limit: 10 }));
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessage || "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  const handleAddClick = () => {
    router.push("roles/create");
  };

  const handleRowClick = (item: any) => {
    router.push(`roles/${item.id}`);
  };


  // Show error state
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <ToastProvider>
      <Breadcrumb pageName="Roles" />

      <DataTable
        type="Role"
        data={rolesData || []} // Access the data property from the paginated response
        columns={columns}
        onAddClick={handleAddClick}
        onRowClick={handleRowClick}
        loading={isLoading}
        pageSize={5}
      />
    </ToastProvider>
  );
};

export default RolesPage;