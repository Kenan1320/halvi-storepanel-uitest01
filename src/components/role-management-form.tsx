"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
// import { toast } from "@/components/ui/use-toast"

interface Module {
  id: string
  name: string
}

interface Role {
  id?: string
  name: string
  description?: string
  permissions: {
    module: string
    permissions: string[]
  }[]
}

interface PermissionData {
  moduleId: string
  moduleName: string
  permissionActions: Record<string, boolean>
}

const availableModules: Module[] = [
  { id: "users", name: "Users" },
  { id: "products", name: "Products" },
  { id: "orders", name: "Orders" },
  { id: "customers", name: "Customers" },
  { id: "inventory", name: "Inventory" },
  { id: "reports", name: "Reports" },
  { id: "settings", name: "Settings" },
  { id: "billing", name: "Billing" },
]

const permissionTypes = ["List", "Update", "Create", "Delete"]

export default function RoleManagementForm({ 
  initialData,
  onSave,
  isSubmitting 
}: {
  initialData?: Role
  onSave: (data: Role) => Promise<void>
  isSubmitting: boolean
}) {
  const router = useRouter()
  const [roleName, setRoleName] = useState(initialData?.name || "")
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [permissionData, setPermissionData] = useState<PermissionData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectAll, setSelectAll] = useState(false)

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setRoleName(initialData.name)
      const modules = initialData.permissions.map(p => p.module)
      setSelectedModules(modules)
      
      const initialPermissions = initialData.permissions.map(perm => ({
        moduleId: perm.module,
        moduleName: availableModules.find(m => m.id === perm.module)?.name || perm.module,
        permissionActions: permissionTypes.reduce((acc, type) => ({
          ...acc,
          [type]: perm.permissions.includes(type)
        }), {} as Record<string, boolean>)
      }))
      
      setPermissionData(initialPermissions)
      
      // Check if all permissions are selected
      const allSelected = initialPermissions.every(perm => 
        Object.values(perm.permissionActions).every(Boolean))
      setSelectAll(allSelected)
    }
  }, [initialData])

  // Update permission data when modules change
  useEffect(() => {
    const newPermissionData = [...permissionData]
    
    // Add new modules
    selectedModules.forEach(moduleId => {
      if (!newPermissionData.some(p => p.moduleId === moduleId)) {
        const module = availableModules.find(m => m.id === moduleId)
        newPermissionData.push({
          moduleId,
          moduleName: module?.name || moduleId,
          permissionActions: permissionTypes.reduce((acc, type) => ({
            ...acc,
            [type]: false
          }), {} as Record<string, boolean>)
        })
      }
    })
    
    // Remove unselected modules
    const updatedPermissionData = newPermissionData.filter(p => 
      selectedModules.includes(p.moduleId)
    )
    
    setPermissionData(updatedPermissionData)
  }, [selectedModules])

  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(id => id !== moduleId))
    } else {
      setSelectedModules([...selectedModules, moduleId])
    }
  }

  // Handle permission checkbox change
  const handlePermissionChange = (moduleId: string, permissionType: string, checked: boolean) => {
    setPermissionData(prev => 
      prev.map(item => 
        item.moduleId === moduleId 
          ? { 
              ...item, 
              permissionActions: { 
                ...item.permissionActions, 
                [permissionType]: checked 
              } 
            } 
          : item
      )
    )
  }

  // Toggle all permissions for a module
  const toggleModulePermissions = (moduleId: string) => {
    const module = permissionData.find(p => p.moduleId === moduleId)
    if (!module) return

    const allChecked = Object.values(module.permissionActions).every(Boolean)
    
    setPermissionData(prev => 
      prev.map(item => 
        item.moduleId === moduleId 
          ? { 
              ...item, 
              permissionActions: Object.keys(item.permissionActions).reduce(
                (acc, type) => ({ ...acc, [type]: !allChecked }), 
                {} as Record<string, boolean>
              ) 
            } 
          : item
      )
    )
  }

  // Toggle all permissions for all modules
  const toggleAllPermissions = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    
    setPermissionData(prev => 
      prev.map(item => ({
        ...item,
        permissionActions: Object.keys(item.permissionActions).reduce(
          (acc, type) => ({ ...acc, [type]: newSelectAll }), 
          {} as Record<string, boolean>
        )
      }))
    )
  }

  // Toggle all permissions of a specific type across modules
  const togglePermissionType = (permissionType: string) => {
    const allChecked = permissionData.every(p => p.permissionActions[permissionType])
    
    setPermissionData(prev => 
      prev.map(item => ({
        ...item,
        permissionActions: {
          ...item.permissionActions,
          [permissionType]: !allChecked
        }
      }))
    )
  }

  // Remove a selected module
  const removeModule = (moduleId: string) => {
    setSelectedModules(selectedModules.filter(id => id !== moduleId))
  }

  // Filter modules based on search query
  const filteredModules = permissionData.filter(perm => 
    perm.moduleName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage)
  const paginatedModules = filteredModules.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  )

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate at least one permission is selected
    const hasPermissions = permissionData.some(perm => 
      Object.values(perm.permissionActions).some(Boolean)
    )
    
    if (!hasPermissions) {
    //   toast({
    //     title: "Error",
    //     description: "At least one permission must be selected",
    //     variant: "destructive"
    //   })
      return
    }

    // Prepare role data
    const roleData: Role = {
      name: roleName,
      permissions: permissionData
        .filter(perm => Object.values(perm.permissionActions).some(Boolean))
        .map(perm => ({
          module: perm.moduleId,
          permissions: Object.entries(perm.permissionActions)
            .filter(([_, isChecked]) => isChecked)
            .map(([type]) => type)
        }))
    }

    if (initialData?.id) {
      roleData.id = initialData.id
    }

    try {
      await onSave(roleData)
    //   toast({
    //     title: "Success",
    //     description: `Role ${initialData ? "updated" : "created"} successfully`
    //   })
    //   router.push("/admin/roles")
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: `Failed to ${initialData ? "update" : "create"} role`,
    //     variant: "destructive"
    //   })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Role" : "Create New Role"}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>

          {/* Modules Multi-select */}
          <div className="space-y-2">
            <Label>Modules</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedModules.map(moduleId => {
                const module = availableModules.find(m => m.id === moduleId)
                return (
                  <Badge key={moduleId} variant="secondary" className="flex items-center gap-1">
                    {module?.name}
                    <button
                      type="button"
                      onClick={() => removeModule(moduleId)}
                      className="ml-1 rounded-full hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
            <Select onValueChange={handleModuleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select modules" />
              </SelectTrigger>
              <SelectContent>
                {availableModules
                  .filter(module => !selectedModules.includes(module.id))
                  .map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Permissions Table */}
          {selectedModules.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Permissions</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search modules..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/50">
                  <div className="font-medium flex gap-2 items-center">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={() => toggleAllPermissions()}
                    />
                    All
                  </div>
                  {permissionTypes.map(type => (
                    <div key={type} className="font-medium text-center flex gap-2 items-center justify-center">
                      <Checkbox
                        checked={permissionData.every(p => p.permissionActions[type])}
                        onCheckedChange={() => togglePermissionType(type)}
                      />
                      {type}
                    </div>
                  ))}
                </div>

                {paginatedModules.length > 0 ? (
                  paginatedModules.map(perm => (
                    <div key={perm.moduleId} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0">
                      <div className="flex gap-2 items-center">
                        <Checkbox
                          checked={Object.values(perm.permissionActions).every(Boolean)}
                          onCheckedChange={() => toggleModulePermissions(perm.moduleId)}
                        />
                        {perm.moduleName}
                      </div>
                      {permissionTypes.map(type => (
                        <div key={`${perm.moduleId}-${type}`} className="flex justify-center">
                          <Checkbox
                            checked={perm.permissionActions[type] || false}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(perm.moduleId, type, checked === true)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No modules match your search
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredModules.length > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="items-per-page">Show</Label>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger id="items-per-page" className="w-[70px]">
                        <SelectValue>{itemsPerPage}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20].map(value => (
                          <SelectItem key={value} value={value.toString()}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                      of {filteredModules.length} items
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            type="button"
            onClick={() => router.push("/access-control/roles")}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : initialData ? "Update Role" : "Create Role"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}