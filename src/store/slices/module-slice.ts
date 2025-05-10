import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Module } from "../../types/roles.type";
import ModuleApi from "../../api/module-api";
import { RootState } from "..";

type TModuleState = {
  modules: Module[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: TModuleState = {
  modules: null,
  loading: false,
  error: null,
};

export const getAllModules = createAsyncThunk(
  "roles/getModules",
  async (_, thunkApi) => {
    try {
      const response = await ModuleApi.getAllModules();
      if(response){
        return thunkApi.fulfillWithValue(response.data);
      }
     
      // console.log(response , "modules")
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const moduleSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    resetRoleState: (state) => {
      state.modules = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllModules.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllModules.fulfilled, (state, action) => {
      state.loading = false;
      state.modules = action.payload??[];
    });
    builder.addCase(getAllModules.rejected, (state) => {
      state.loading = false;
      state.modules = null;
    });
  },
});

export const { resetRoleState } = moduleSlice.actions;
export const modules = (state: RootState) => state.module.modules;
export const error = (state: RootState) => state.module.error;
export default moduleSlice.reducer;
