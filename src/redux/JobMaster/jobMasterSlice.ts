import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { JobMasterRespType, JobMasterSlice } from "@/@types/jobMaster";
import toast from "react-hot-toast";

const initialState: JobMasterSlice = {
    status: STATUES.IDLE,
    error: null,
    jobMasters: [],
};

export const getAllJobMasters = createAsyncThunk<JobMasterRespType, void>("user/jobMasters/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<JobMasterRespType>(Endpoints.getAllJobMasters);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateJobMaster = createAsyncThunk<JobMasterRespType, any>("user/jobMasters/update/:id/Job", async ({ id, ...jobMasterData }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<JobMasterRespType>(`${Endpoints.updateJobMaster}/${id}`, {
            ...jobMasterData
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const jobMasterSlice = createSlice({
    name: "jobMaster",
    initialState,
    reducers: {}, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllJobMasters.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.jobMasters = [];
            })
            .addCase(getAllJobMasters.fulfilled, (state, { payload }: PayloadAction<JobMasterRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.jobMasters = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.jobMasters = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllJobMasters.rejected, (state, { payload }: PayloadAction<JobMasterRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.jobMasters = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(updateJobMaster.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateJobMaster.fulfilled, (state, { payload }: PayloadAction<JobMasterRespType | any>) => {
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
            .addCase(updateJobMaster.rejected, (state, { payload }: PayloadAction<JobMasterRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export default jobMasterSlice;