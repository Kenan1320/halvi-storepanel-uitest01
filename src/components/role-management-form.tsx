"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { ModulePermission, PermissionAction } from "@/types/roles.type"
import { createRole, getRoleById, updateRole } from "@/store/slices/role-slice"
import { toast } from "@/hooks/use-toast"
import { getAllModules } from "@/store/slices/module-slice"

const validationSchema = Yup.object({
  name: Yup.string().required("Role name is required"),
  description: Yup.string().required("Description is required"),
  permissions: Yup.array()
    .of(
      Yup.object({
        moduleId: Yup.number().required(),
        permissions: Yup.array().min(1, "At least one permission is required")
      })
    )
    .min(1, "At least one module is required")
})

export default function RoleManagementForm({ 
  roleId,
  onSuccess
}: {
  roleId?: number
  onSuccess?: () => void
}) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { modules } = useAppSelector((state) => state.module)
  const { role, loading: roleLoading } = useAppSelector((state) => state.role)

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      permissions: [] as Array<{
        moduleId: number
        permissions: PermissionAction[]
      }>
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (roleId) {
          await dispatch(updateRole({ id: roleId, roleData: {
            id:roleId,
            ...values
          } })).unwrap()
          toast({
            title: "Success",
            description: "Role updated successfully"
          })
        } else {
          await dispatch(createRole(values)).unwrap()
          toast({
            title: "Success",
            description: "Role created successfully"
          })
        }
        
        onSuccess ? onSuccess() : router.push("/access-control/roles")
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || `Failed to ${roleId ? "update" : "create"} role`,
          variant: "destructive"
        })
      }
    }
  })

  // Initialize permission data state
  const [permissionData, setPermissionData] = useState<ModulePermission[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectAll, setSelectAll] = useState(false)

  // Load modules and role data
  useEffect(() => {
    dispatch(getAllModules())
    if (roleId) dispatch(getRoleById(roleId))
  }, [roleId, dispatch])

  // Initialize form with role data
  useEffect(() => {
    if (role) {
      formik.setValues({
        name: role.name,
        description: role.description,
        permissions: role.permissions.map(p => ({
          moduleId: p.moduleId,
          permissions: p.permissions
        }))
      })

      const initialPermissions = role.permissions.map(perm => ({
        moduleId: perm.moduleId,
        moduleName: modules?.find(m => m.id === perm.moduleId)?.name || perm.moduleId.toString(),
        permissionActions: {
          LIST: perm.permissions.includes("LIST"),
          UPDATE: perm.permissions.includes("UPDATE"),
          DELETE: perm.permissions.includes("DELETE"),
          CREATE: perm.permissions.includes("CREATE")
        }
      }))
      
      setPermissionData(initialPermissions)
      setSelectAll(initialPermissions.every(p => Object.values(p.permissionActions).every(Boolean)))
    }
  }, [role, modules])

  // Handle module selection
  const handleModuleSelect = (moduleId: number) => {
    const currentPermissions = [...formik.values.permissions]
    const moduleIndex = currentPermissions.findIndex(p => p.moduleId === moduleId)

    if (moduleIndex >= 0) {
      // Remove module
      currentPermissions.splice(moduleIndex, 1)
      setPermissionData(prev => prev.filter(p => p.moduleId !== moduleId))
    } else {
      // Add module
      currentPermissions.push({
        moduleId,
        permissions: []
      })
      const module = modules?.find(m => m.id === moduleId)
      setPermissionData(prev => [
        ...prev,
        {
          moduleId,
          moduleName: module?.name || moduleId.toString(),
          permissionActions: {
            LIST: false,
            UPDATE: false,
            DELETE: false,
            CREATE: false
          }
        }
      ])
    }

    formik.setFieldValue("permissions", currentPermissions)
  }

  // Handle permission checkbox change
  const handlePermissionChange = (moduleId: number, permissionType: PermissionAction, checked: boolean) => {
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

    // Update formik values
    const updatedPermissions = formik.values.permissions.map(p => {
      if (p.moduleId === moduleId) {
        const permissions = checked
          ? [...p.permissions, permissionType]
          : p.permissions.filter(perm => perm !== permissionType)
        return { ...p, permissions }
      }
      return p
    })

    formik.setFieldValue("permissions", updatedPermissions)
  }

  // Toggle all permissions for a module
  const toggleModulePermissions = (moduleId: number) => {
    const module = permissionData.find(p => p.moduleId === moduleId)
    if (!module) return

    const allChecked = Object.values(module.permissionActions).every(Boolean)
    const newPermissions = allChecked ? [] : ["LIST", "UPDATE", "DELETE", "CREATE"] as PermissionAction[]

    setPermissionData(prev => 
      prev.map(item => 
        item.moduleId === moduleId 
          ? { 
              ...item, 
              permissionActions: {
                LIST: !allChecked,
                UPDATE: !allChecked,
                DELETE: !allChecked,
                CREATE: !allChecked
              }
            } 
          : item
      )
    )

    // Update formik values
    const updatedPermissions = formik.values.permissions.map(p => 
      p.moduleId === moduleId ? { ...p, permissions: newPermissions } : p
    )
    formik.setFieldValue("permissions", updatedPermissions)
  }

  // Toggle all permissions for all modules
  const toggleAllPermissions = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    
    const newPermissions = newSelectAll 
      ? ["LIST", "UPDATE", "DELETE", "CREATE"] as PermissionAction[]
      : []

    setPermissionData(prev => 
      prev.map(item => ({
        ...item,
        permissionActions: {
          LIST: newSelectAll,
          UPDATE: newSelectAll,
          DELETE: newSelectAll,
          CREATE: newSelectAll
        }
      }))
    )

    // Update formik values
    const updatedPermissions = formik.values.permissions.map(p => ({
      ...p,
      permissions: newPermissions
    }))
    formik.setFieldValue("permissions", updatedPermissions)
  }

  // Toggle all permissions of a specific type across modules
  const togglePermissionType = (permissionType: PermissionAction) => {
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

    // Update formik values
    const updatedPermissions = formik.values.permissions.map(p => {
      const hasPermission = p.permissions.includes(permissionType)
      const permissions = allChecked
        ? p.permissions.filter(perm => perm !== permissionType)
        : [...p.permissions, permissionType]
      return { ...p, permissions }
    })
    formik.setFieldValue("permissions", updatedPermissions)
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

  if (roleId && roleLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{roleId ? "Edit Role" : "Create New Role"}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {roleId ? "Edit Role" : "Create New Role"}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={formik.handleSubmit}>
        <CardContent className="space-y-6">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter role name"
              disabled={formik.isSubmitting}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-sm text-red-500">{formik.errors.name}</div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter role description"
              disabled={formik.isSubmitting}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-sm text-red-500">{formik.errors.description}</div>
            )}
          </div>

          {/* Modules Multi-select */}
          <div className="space-y-2">
            <Label>Modules</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formik.values.permissions.map(({ moduleId }) => {
                const module = modules?.find(m => m.id === moduleId)
                return (
                  <Badge key={moduleId} variant="secondary" className="flex items-center gap-1">
                    {module?.name}
                    <button
                      type="button"
                      onClick={() => handleModuleSelect(moduleId)}
                      className="ml-1 rounded-full hover:bg-muted"
                      disabled={formik.isSubmitting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
            <Select 
              onValueChange={(value) => handleModuleSelect(Number(value))}
              disabled={formik.isSubmitting || !modules}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select modules" />
              </SelectTrigger>
              <SelectContent>
                {modules
                  ?.filter(module => !formik.values.permissions.some(p => p.moduleId === module.id))
                  .map(module => (
                    <SelectItem key={module.id} value={module.id.toString()}>
                      {module.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {formik.touched.permissions && formik.errors.permissions && (
              <div className="text-sm text-red-500">At least one module is required</div>
            )}
          </div>

          {/* Permissions Table */}
          {formik.values.permissions.length > 0 && (
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
                    disabled={formik.isSubmitting}
                  />
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/50">
                  <div className="font-medium flex gap-2 items-center">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={() => toggleAllPermissions()}
                      disabled={formik.isSubmitting}
                    />
                    All
                  </div>
                  {(["LIST", "UPDATE", "DELETE", "CREATE"] as PermissionAction[]).map(type => (
                    <div key={type} className="font-medium text-center flex gap-2 items-center justify-center">
                      <Checkbox
                        checked={permissionData.every(p => p.permissionActions[type])}
                        onCheckedChange={() => togglePermissionType(type)}
                        disabled={formik.isSubmitting}
                      />
                      {type}
                    </div>
                  ))}
                </div>

                {paginatedModules.length > 0 ? (
                  paginatedModules.map(perm => {
                    const modulePermissions = formik.values.permissions.find(p => p.moduleId === perm.moduleId)
                    const hasError = formik.touched.permissions && 
                                    modulePermissions?.permissions.length === 0

                    return (
                      <div key={perm.moduleId} className={`grid grid-cols-5 gap-4 p-4 border-b last:border-0 ${hasError ? "bg-red-50" : ""}`}>
                        <div className="flex gap-2 items-center">
                          <Checkbox
                            checked={Object.values(perm.permissionActions).every(Boolean)}
                            onCheckedChange={() => toggleModulePermissions(perm.moduleId)}
                            disabled={formik.isSubmitting}
                          />
                          {perm.moduleName}
                        </div>
                        {(["LIST", "UPDATE", "DELETE", "CREATE"] as PermissionAction[]).map(type => (
                          <div key={`${perm.moduleId}-${type}`} className="flex justify-center">
                            <Checkbox
                              checked={perm.permissionActions[type]}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(perm.moduleId, type, checked === true)
                              }
                              disabled={formik.isSubmitting}
                            />
                          </div>
                        ))}
                        {hasError && (
                          <div className="col-span-5 text-sm text-red-500">
                            At least one permission is required for this module
                          </div>
                        )}
                      </div>
                    )
                  })
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
                      disabled={formik.isSubmitting}
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
                      disabled={currentPage === 1 || formik.isSubmitting}
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
                      disabled={currentPage === totalPages || totalPages === 0 || formik.isSubmitting}
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
            disabled={formik.isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving..." : roleId ? "Update Role" : "Create Role"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}