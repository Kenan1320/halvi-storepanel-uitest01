"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type Column = {
    key: string
    label: string
    render?: (value: any, item: any) => React.ReactNode
    filterable?: boolean
    filterOptions?: string[]
}

export type DataTableProps = {
    type?: string;
    data: any[]
    columns: Column[]
    onAddClick?: () => void
    onRowClick?: (item: any) => void
    pageSize?: number
}

export function DataTable({
    type = "Data Table",
    data = [],
    columns = [],
    onAddClick,
    onRowClick,
    pageSize = 5,
}: DataTableProps) {
    const [filteredData, setFilteredData] = useState<any[]>(data)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<Record<string, string>>({})

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / pageSize)

    // Get current page data
    const currentData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    // Apply filters and search
    useEffect(() => {
        let result = [...data]

        // Apply search
        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase()
            result = result.filter((item) =>
                columns.some((column) => String(item[column.key]).toLowerCase().includes(lowercasedSearch)),
            )
        }

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "all") {
                result = result.filter((item) => String(item[key]) === value)
            }
        })

        setFilteredData(result)
        setCurrentPage(1) // Reset to first page when filters change
    }, [data, searchTerm, filters, columns])

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1)
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    const goToLastPage = () => setCurrentPage(totalPages)

    // Filter handlers
    const handleFilterChange = (columnKey: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [columnKey]: value,
        }))
    }

    // Get filterable columns
    const filterableColumns = columns.filter((col) => col.filterable)
    const plural = (type==="Category"?type.toLowerCase().slice(0, -1)+"ies":type.toLowerCase()+"s")
    return (
        <Card className="w-full shadow-sm dark:bg-gray-dark">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <CardTitle>{type+ " List"}</CardTitle>
                        <CardDescription>{'View and manage all the '+plural }</CardDescription>
                    </div>


                    {onAddClick && (
                        <Button onClick={onAddClick} className="shrink-0">
                            <Plus className="h-4 w-4 mr-2" />
                            {"Create "+ type}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={"search "+ plural+"..."}
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            {filterableColumns.map((column) => (
                                <Select
                                    key={column.key}
                                    value={filters[column.key] || "all"}
                                    onValueChange={(value) => handleFilterChange(column.key, value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={`Filter by ${column.label}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All {column.label}s</SelectItem>
                                        {column.filterOptions?.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ))}

                            {Object.keys(filters).length > 0 && (
                                <Button variant="outline" size="sm" onClick={() => setFilters({})} className="h-10">
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Active filters display */}
                    {Object.keys(filters).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(filters).map(([key, value]) => {
                                if (value && value !== "all") {
                                    const column = columns.find((col) => col.key === key)
                                    return (
                                        <Badge key={key} variant="secondary" className="px-3 py-1">
                                            {column?.label}: {value}
                                            <button className="ml-2 text-xs" onClick={() => handleFilterChange(key, "all")}>
                                                ×
                                            </button>
                                        </Badge>
                                    )
                                }
                                return null
                            })}
                        </div>
                    )}

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableHead key={column.key}>{column.label}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentData.length > 0 ? (
                                    currentData.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            onClick={() => onRowClick && onRowClick(item)}
                                            className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                                        >
                                            {columns.map((column) => (
                                                <TableCell key={`${index}-${column.key}`}>
                                                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            {`No ${plural} found. Try adjusting your filters.`}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {filteredData.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)} to{" "}
                                {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="icon" onClick={goToFirstPage} disabled={currentPage === 1}>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">
                                    Page {currentPage} of {totalPages || 1}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToLastPage}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
