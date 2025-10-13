import type { EmployeeInpType, EmployeeRespType, EmployeeSlice, UpdateEmployeeType } from "@/@types/employee";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: EmployeeSlice = {
    status: STATUES.IDLE,
    error: null,
    employee: null,
    employees: [],
};

export const getAllEmployees = createAsyncThunk<EmployeeRespType, void>("user/employees/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<EmployeeRespType>(Endpoints.getAllEmployees);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getEmployeeById = createAsyncThunk<EmployeeRespType, string>("user/employee/fetch/:id/Job", async (employeeId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<EmployeeRespType>(`${Endpoints.getEmployeeById}/${employeeId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addEmployee = createAsyncThunk<EmployeeRespType, EmployeeInpType>("user/employee/add/Job", async (employeeData, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<EmployeeRespType>(Endpoints.addEmployee, {
            ...employeeData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateEmployee = createAsyncThunk<EmployeeRespType, UpdateEmployeeType>("user/employee/update/:id/Job", async ({ id, ...employeeData }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<EmployeeRespType>(`${Endpoints.updateEmployee}/${id}`, {
            ...employeeData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteEmployee = createAsyncThunk<EmployeeRespType, string>("user/employee/delete/:id/Job", async (employeeId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.deleteRequest<EmployeeRespType>(`${Endpoints.deleteEmployee}/${employeeId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {}, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllEmployees.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.employees = [];
            })
            .addCase(getAllEmployees.fulfilled, (state, { payload }: PayloadAction<EmployeeRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.employees = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.employees = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllEmployees.rejected, (state, { payload }: PayloadAction<EmployeeRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.employees = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getEmployeeById.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.employee = null;
            })
            .addCase(getEmployeeById.fulfilled, (state, { payload }: PayloadAction<EmployeeRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.employee = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.employee = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getEmployeeById.rejected, (state, { payload }: PayloadAction<EmployeeRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.employee = null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(addEmployee.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(addEmployee.fulfilled, (state, { payload }: PayloadAction<EmployeeRespType | any>) => {
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
            .addCase(addEmployee.rejected, (state, { payload }: PayloadAction<EmployeeRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(updateEmployee.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, { payload }: PayloadAction<EmployeeRespType | any>) => {
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
            .addCase(updateEmployee.rejected, (state, { payload }: PayloadAction<EmployeeRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(deleteEmployee.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(deleteEmployee.fulfilled, (state, { payload }: PayloadAction<EmployeeRespType>) => {
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
            .addCase(deleteEmployee.rejected, (state, { payload }: PayloadAction<EmployeeRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export default employeeSlice;