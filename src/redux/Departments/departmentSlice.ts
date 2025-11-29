import type { DepartmentRespType, DepartmentSlice, DepartmentType, UpdateDepartmentType } from "@/@types/department";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: DepartmentSlice = {
    status: STATUES.IDLE,
    error: null,
    department: null,
    departments: [],
    deptCode: null,
};

export const getAllDepartments = createAsyncThunk<DepartmentRespType, void>("user/department/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<DepartmentRespType>(Endpoints.getAllDepartments);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getDepartmentById = createAsyncThunk<DepartmentRespType, string>("user/department/fetch/:id/Job", async (departmentId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<DepartmentRespType>(`${Endpoints.getDepartmentByCode}/${departmentId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addDepartment = createAsyncThunk<DepartmentRespType, DepartmentType>("user/department/add/Job", async (departmentData, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<DepartmentRespType>(Endpoints.addDepartment, {
            ...departmentData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateDepartment = createAsyncThunk<DepartmentRespType, UpdateDepartmentType>("user/department/update/:id/Job", async ({ id, DeptName, DeptStatus }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<DepartmentRespType>(`${Endpoints.updateDepartment}/${id}`, {
            DeptName,
            DeptStatus,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteDepartment = createAsyncThunk<DepartmentRespType, string>("user/department/delete/:id/Job", async (departmentId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.deleteRequest<DepartmentRespType>(`${Endpoints.deleteDepartment}/${departmentId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const departmentSlice = createSlice({
    name: "department",
    initialState,
    reducers: {
        add_department_employee: (state, action: PayloadAction<string>) => {
            state.deptCode = action.payload;
        },
    }, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllDepartments.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.departments = [];
            })
            .addCase(getAllDepartments.fulfilled, (state, { payload }: PayloadAction<DepartmentRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.departments = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.departments = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllDepartments.rejected, (state, { payload }: PayloadAction<DepartmentRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.departments = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getDepartmentById.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.department = null;
            })
            .addCase(getDepartmentById.fulfilled, (state, { payload }: PayloadAction<DepartmentRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.department = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.department = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getDepartmentById.rejected, (state, { payload }: PayloadAction<DepartmentRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.department = null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(addDepartment.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(addDepartment.fulfilled, (state, { payload }: PayloadAction<DepartmentRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.deptCode = payload?.data?.DeptCode;
                    toast.success(payload?.message);
                } else {
                    state.status = STATUES.ERROR;
                    state.deptCode = null;
                    state.error = payload.message || null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(addDepartment.rejected, (state, { payload }: PayloadAction<DepartmentRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(updateDepartment.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateDepartment.fulfilled, (state, { payload }: PayloadAction<DepartmentRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    toast.success(payload?.message);
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(updateDepartment.rejected, (state, { payload }: PayloadAction<DepartmentRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(deleteDepartment.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(deleteDepartment.fulfilled, (state, { payload }: PayloadAction<DepartmentRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    toast.success(payload?.message);
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(deleteDepartment.rejected, (state, { payload }: PayloadAction<DepartmentRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export const {add_department_employee} = departmentSlice.actions;
export default departmentSlice;