"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
import { Column, DataTable } from "@/components/Tables/data-table";
import { Badge } from "@/components/ui/badge";
import { ToastProvider } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { Suspense } from "react";
import { OverviewCardsSkeleton } from "../home/_components/overview-cards/skeleton";
import { OverviewCardsGroup } from "../home/_components/overview-cards";
import * as icons from "../home/_components/overview-cards/icons"
import { getOverviewData } from "../home/fetch";
import { NewReleases, ShoppingBagTwoTone, StorefrontTwoTone, StoreMallDirectoryTwoTone } from "@mui/icons-material";
import StoreSetupForm from "@/components/store-setup-form";

const StoresPage = () => {
  const handleAddClick = () => {
    toast({
      title: "Add New Store",
      description: "This would open a form to add a new store",
    })
  }

  const handleRowClick = (item: any) => {
    toast({
      title: "Store Selected",
      description: `You clicked on ${item.name}`,
    })
  }
  
  const overviewData = [{
    label: "Total Orders",
    data: {
      value: 10,
      growthRate: 10,
    },
    icon: ShoppingBagTwoTone
  },
  {
    label: "Active Stores",
    data: {
      value: 8, // Updated to match the active stores in the data
      growthRate: 10,
    },
    icon: StoreMallDirectoryTwoTone
  },
  {
    label: "In-Active Stores",
    data: {
      value: 1, // Updated to match the inactive stores in the data
      growthRate: 10,
    },
    icon: StorefrontTwoTone
  },
  {
    label: "Newly Joined Stores",
    data: {
      value: 10,
      growthRate: 10,
    },
    icon: NewReleases
  }]

  return (
    <ToastProvider>
      <Breadcrumb pageName="Stores" />
      <StoreSetupForm />
    </ToastProvider>
  );
};

export default StoresPage;