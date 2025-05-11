"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
import { Column, DataTable } from "@/components/Tables/data-table";
import { Badge } from "@/components/ui/badge";
import { ToastProvider } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import * as icons from "../home/_components/overview-cards/icons"
import { getOverviewData } from "../home/fetch";
import { Suspense } from "react";
import { OverviewCardsGroup } from "../home/_components/overview-cards";
import { OverviewCardsSkeleton } from "../home/_components/overview-cards/skeleton";
import { DoneAll, LocalMallTwoTone, PlaceTwoTone, ShoppingBag } from "@mui/icons-material";

// Sample data
const sampleData = [
  {
    id: 1,
    name: "Product A",
    description: "High-quality product with premium features",
    status: "Active",
    category: "Electronics",
    createdAt: "2023-05-10",
  },
  {
    id: 2,
    name: "Service B",
    description: "Professional service with guaranteed satisfaction",
    status: "Inactive",
    category: "Services",
    createdAt: "2023-06-15",
  },
  {
    id: 3,
    name: "Software C",
    description: "Cutting-edge software solution for businesses",
    status: "Active",
    category: "Software",
    createdAt: "2023-04-22",
  },
  {
    id: 4,
    name: "Hardware D",
    description: "Durable hardware components for all your needs",
    status: "Active",
    category: "Electronics",
    createdAt: "2023-07-03",
  },
  {
    id: 5,
    name: "Consultation E",
    description: "Expert consultation services for your business",
    status: "Pending",
    category: "Services",
    createdAt: "2023-08-12",
  },
  {
    id: 6,
    name: "Tool F",
    description: "Essential tools for professional use",
    status: "Active",
    category: "Hardware",
    createdAt: "2023-03-28",
  },
  {
    id: 7,
    name: "Application G",
    description: "User-friendly application with advanced features",
    status: "Inactive",
    category: "Software",
    createdAt: "2023-09-05",
  },
  {
    id: 8,
    name: "Device H",
    description: "Smart devices for modern living",
    status: "Active",
    category: "Electronics",
    createdAt: "2023-02-18",
  },
  {
    id: 9,
    name: "Support I",
    description: "24/7 customer support for all products",
    status: "Active",
    category: "Services",
    createdAt: "2023-10-01",
  },
  {
    id: 10,
    name: "Platform J",
    description: "Comprehensive platform for business management",
    status: "Pending",
    category: "Software",
    createdAt: "2023-01-30",
  },
  {
    id: 11,
    name: "Component K",
    description: "High-performance components for system integration",
    status: "Active",
    category: "Hardware",
    createdAt: "2023-11-11",
  },
  {
    id: 12,
    name: "Solution L",
    description: "Complete solution for enterprise needs",
    status: "Inactive",
    category: "Services",
    createdAt: "2023-12-05",
  },
]

// Define columns
const columns: Column[] = [
  {
    key: "name",
    label: "Name",
    filterable: true,
    filterOptions: ["Product A", "Service B", "Software C", "Hardware D", "Consultation E"],
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "status",
    label: "Status",
    filterable: true,
    filterOptions: ["Active", "Inactive", "Pending"],
    render: (value) => {
      const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
        Active: { variant: "default" },
        Inactive: { variant: "destructive" },
        Pending: { variant: "secondary" },
      }

      return <Badge variant={variants[value]?.variant || "outline"}>{value.status}</Badge>
    },
  },
  {
    key: "category",
    label: "Category",
    filterable: true,
    filterOptions: ["Electronics", "Services", "Software", "Hardware"],
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (value) => new Date(value.createdAt).toLocaleDateString(),
  },
]



const OrdersPage =  () => {


  const handleAddClick = () => {
    toast({
      title: "Add New Item",
      description: "This would open a form to add a new item",
    })
  }

  const handleRowClick = (item: any) => {
    toast({
      title: "Item Selected",
      description: `You clicked on ${item.name}`,
    })
  }

  const overviewData = [{
    label: "Total Orders",
    data: {
      value: 10,
      growthRate: 10,
  },
    icon: ShoppingBag
  },
  {
    label: "Order Placed",
    data:{
      value: 10,
      growthRate: 10,
  },
    icon: PlaceTwoTone
  },
  {
    label: "Order Accepted",
    data: {
      value: 10,
      growthRate: 10,
  },
    icon: DoneAll
  },
  {
    label: "Order Completed",
    data: {
      value: 10,
      growthRate: 10,
  },
    icon: LocalMallTwoTone
  }
  ]


  return (
    <ToastProvider>
      <Breadcrumb pageName="Orders" />
      <DataTable
        type="Order"
        data={sampleData}
        columns={columns}
        onAddClick={handleAddClick}
        onRowClick={handleRowClick}
        pageSize={5}
      />
    </ToastProvider>
  );
};

export default OrdersPage;
