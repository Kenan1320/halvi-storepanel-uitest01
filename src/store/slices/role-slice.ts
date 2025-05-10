import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RoleApi from "../../api/role-api";
import { RootState } from "../index";
import { 
  Role, 
  RolesResponse,
  RoleResponse,
  CreateRolePayload,
  UpdateRolePayload
} from "../../types/roles.type";

type TRoleState = {
  roles: Role[] | null;
  role: Role | null;
  loading: boolean;
  error: string | null;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
};

const initialState: TRoleState = {
  roles: null,
  role: null,
  loading: false,
  error: null,
  pagination: undefined
};

export const getAllRoles = createAsyncThunk(
  "roles/getAll",
  async (paginationParams: { page: number; limit: number }, thunkApi) => {
    try {
      const response = await RoleApi.getRolesPagination(paginationParams);
      return thunkApi.fulfillWithValue(response);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const getRoleById = createAsyncThunk(
  "roles/getById",
  async (id: number, thunkApi) => {
    try {
      const response = await RoleApi.get(id);
      return thunkApi.fulfillWithValue(response);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const createRole = createAsyncThunk(
  "roles/create",
  async (roleData: CreateRolePayload, thunkApi) => {
    try {
      const response = await RoleApi.create(roleData);
      return thunkApi.fulfillWithValue(response);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message || 'Failed to create role');
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/update",
  async ({ id, roleData }: { id: number; roleData: UpdateRolePayload }, thunkApi) => {
    try {
      const response = await RoleApi.update(id, roleData);
      return thunkApi.fulfillWithValue(response);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message || 'Failed to update role');
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/delete",
  async (id: number, thunkApi) => {
    try {
      await RoleApi.delete(id);
      return thunkApi.fulfillWithValue(id);
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    resetRoleState: (state) => {
      state.roles = null;
      state.role = null;
      state.loading = false;
      state.error = null;
      state.pagination = undefined;
    },
  },
  extraReducers: (builder) => {
    // Get All Roles
    builder.addCase(getAllRoles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllRoles.fulfilled, (state, action) => {
      state.loading = false;
      state.roles = action.payload?.data || null;
      state.pagination = action.payload?.pagination;
    });
    builder.addCase(getAllRoles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Role By ID
    builder.addCase(getRoleById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRoleById.fulfilled, (state, action) => {
      state.loading = false;
      state.role = action.payload?.data || null;
    });
    builder.addCase(getRoleById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Role
    builder.addCase(createRole.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRole.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && state.roles) {
        state.roles = [...state.roles, action.payload];
      }
    });
    builder.addCase(createRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Role
    builder.addCase(updateRole.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRole.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.data && state.roles) {
        const updatedRole = action.payload.data;
        state.role = updatedRole;
        state.roles = state.roles.map(role => 
          role.id === updatedRole.id ? updatedRole : role
        );
      }
    });
    builder.addCase(updateRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Role
    builder.addCase(deleteRole.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteRole.fulfilled, (state, action) => {
      state.loading = false;
      if (state.roles) {
        state.roles = state.roles.filter(role => role.id !== action.payload);
      }
      if (state.role?.id === action.payload) {
        state.role = null;
      }
    });
    builder.addCase(deleteRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetRoleState } = roleSlice.actions;

export const roles = (state: RootState) => state.role.roles;
export const role = (state: RootState) => state.role.role;
export const loading = (state: RootState) => state.role.loading;
export const error = (state: RootState) => state.role.error;
export const selectRolePagination = (state: RootState) => state.role.pagination;

export default roleSlice.reducer;