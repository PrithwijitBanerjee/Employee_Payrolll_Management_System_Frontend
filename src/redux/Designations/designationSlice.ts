import type { DesignationInpType, DesignationRespType, DesignationSlice, UpdateDesignationType } from "@/@types/designation";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: DesignationSlice = {
    status: STATUES.IDLE,
    error: null,
    designation: null,
    designations: [],
    desgCode: null,
};

export const getAllDesignations = createAsyncThunk<DesignationRespType, void>("user/designations/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<DesignationRespType>(Endpoints.getAllDesignations);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getDesignationById = createAsyncThunk<DesignationRespType, string>("user/designation/fetch/:id/Job", async (designationCode, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<DesignationRespType>(`${Endpoints.getDesignationByCode}/${designationCode}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addDesignation = createAsyncThunk<DesignationRespType, DesignationInpType>("user/designation/add/Job", async (designationData, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<DesignationRespType>(Endpoints.addDesignation, {
            ...designationData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateDesignation = createAsyncThunk<DesignationRespType, UpdateDesignationType>("user/designation/update/:id/Job", async ({ id, DesgName, DesgStatus }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<DesignationRespType>(`${Endpoints.updateDesignation}/${id}`, {
            DesgName,
            DesgStatus,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteDesignation = createAsyncThunk<DesignationRespType, string>("user/designation/delete/:id/Job", async (designationId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.deleteRequest<DesignationRespType>(`${Endpoints.deleteDesignation}/${designationId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const designationSlice = createSlice({
    name: "designation",
    initialState,
    reducers: {}, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllDesignations.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.designations = [];
            })
            .addCase(getAllDesignations.fulfilled, (state, { payload }: PayloadAction<DesignationRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.designations = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.designations = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllDesignations.rejected, (state, { payload }: PayloadAction<DesignationRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.designations = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getDesignationById.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.designation = null;
            })
            .addCase(getDesignationById.fulfilled, (state, { payload }: PayloadAction<DesignationRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.designation = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.designation = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getDesignationById.rejected, (state, { payload }: PayloadAction<DesignationRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.designation = null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(addDesignation.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(addDesignation.fulfilled, (state, { payload }: PayloadAction<DesignationRespType | any>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.desgCode = payload?.data?.DesgCode;
                    toast.success(payload?.message);
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.desgCode = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(addDesignation.rejected, (state, { payload }: PayloadAction<DesignationRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(updateDesignation.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateDesignation.fulfilled, (state, { payload }: PayloadAction<DesignationRespType | any>) => {
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
            .addCase(updateDesignation.rejected, (state, { payload }: PayloadAction<DesignationRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(deleteDesignation.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(deleteDesignation.fulfilled, (state, { payload }: PayloadAction<DesignationRespType>) => {
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
            .addCase(deleteDesignation.rejected, (state, { payload }: PayloadAction<DesignationRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export default designationSlice;