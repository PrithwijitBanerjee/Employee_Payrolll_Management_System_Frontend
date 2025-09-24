import type { RoleInputType, RoleRespType, RoleSlice, UpdateRoleInpType } from "@/@types/role";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: RoleSlice = {
    status: STATUES.IDLE,
    error: null,
    roles: [],
    role: null,
};

export const getAllRoles = createAsyncThunk<RoleRespType, void>("user/role/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<RoleRespType>(Endpoints.getAllRolesPublic);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getRoleById = createAsyncThunk<RoleRespType, number>("user/role/fetch/:id/Job", async (roleId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<RoleRespType>(`${Endpoints.getRoleById}/${roleId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addRole = createAsyncThunk<RoleRespType, RoleInputType>("user/role/add/Job", async (roleData, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<RoleRespType>(Endpoints.addRole, {
            ...roleData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateRole = createAsyncThunk<RoleRespType, UpdateRoleInpType>("user/role/update/:id/Job", async ({ id, role }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<RoleRespType>(`${Endpoints.updateRole}/${id}`, {
            role,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteRole = createAsyncThunk<RoleRespType, number>("user/role/delete/:id/Job", async (roleId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.deleteRequest<RoleRespType>(`${Endpoints.deleteRole}/${roleId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {}, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllRoles.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.roles = [];
            })
            .addCase(getAllRoles.fulfilled, (state, { payload }: PayloadAction<RoleRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.roles = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.roles = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllRoles.rejected, (state, { payload }: PayloadAction<RoleRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.roles = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getRoleById.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.role = null;
            })
            .addCase(getRoleById.fulfilled, (state, { payload }: PayloadAction<RoleRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.role = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.role = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getRoleById.rejected, (state, { payload }: PayloadAction<RoleRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.role = null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(addRole.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(addRole.fulfilled, (state, { payload }: PayloadAction<RoleRespType>) => {
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
            .addCase(addRole.rejected, (state, { payload }: PayloadAction<RoleRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(updateRole.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateRole.fulfilled, (state, { payload }: PayloadAction<RoleRespType>) => {
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
            .addCase(updateRole.rejected, (state, { payload }: PayloadAction<RoleRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(deleteRole.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, { payload }: PayloadAction<RoleRespType>) => {
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
            .addCase(deleteRole.rejected, (state, { payload }: PayloadAction<RoleRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export default roleSlice;