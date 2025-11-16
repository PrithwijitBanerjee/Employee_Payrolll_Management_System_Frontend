import type { JobDetailInpType, JobDetailRespType, JobDetailSlice, UpdateJobDetailType } from "@/@types/jobDetails";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: JobDetailSlice = {
    status: STATUES.IDLE,
    error: null,
    jobDetail: null,
    jobDetails: [],
};

export const getAllJobDetails = createAsyncThunk<JobDetailRespType, void>("user/jobDetails/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<JobDetailRespType>(Endpoints.getAllJobDetails);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getJobDetailById = createAsyncThunk<JobDetailRespType, string>("user/jobDetails/fetch/:id/Job", async (jobDetailId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<JobDetailRespType>(`${Endpoints.getJobDetailsById}/${jobDetailId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addJobDetail = createAsyncThunk<JobDetailRespType, JobDetailInpType[]>("user/jobDetails/add/Job", async (jobDetailData, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<JobDetailRespType>(Endpoints.addJobDetails, jobDetailData);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateJobDetail = createAsyncThunk<JobDetailRespType, UpdateJobDetailType>("user/jobDetails/update/:id/Job", async ({ id, ...jobDetailData }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<JobDetailRespType>(`${Endpoints.updateJobDetails}/${id}`, {
            ...jobDetailData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteJobDetail = createAsyncThunk<JobDetailRespType, string | number>("user/jobDetails/delete/:id/Job", async (jobDetailId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.deleteRequest<JobDetailRespType>(`${Endpoints.deleteJobDetails}/${jobDetailId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const jobDetailSlice = createSlice({
    name: "jobDetail",
    initialState,
    reducers: {}, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllJobDetails.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.jobDetails = [];
            })
            .addCase(getAllJobDetails.fulfilled, (state, { payload }: PayloadAction<JobDetailRespType>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.jobDetails = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.jobDetails = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllJobDetails.rejected, (state, { payload }: PayloadAction<JobDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.jobDetails = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getJobDetailById.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.jobDetail = null;
            })
            .addCase(getJobDetailById.fulfilled, (state, { payload }: PayloadAction<JobDetailRespType>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.jobDetail = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.jobDetail = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getJobDetailById.rejected, (state, { payload }: PayloadAction<JobDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.jobDetail = null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(addJobDetail.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(addJobDetail.fulfilled, (state, { payload }: PayloadAction<JobDetailRespType | any>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    toast.success(payload?.message || "Job Detail added successfully");
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(addJobDetail.rejected, (state, { payload }: PayloadAction<JobDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(updateJobDetail.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateJobDetail.fulfilled, (state, { payload }: PayloadAction<JobDetailRespType | any>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    toast.success(payload?.message);
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(updateJobDetail.rejected, (state, { payload }: PayloadAction<JobDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(deleteJobDetail.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(deleteJobDetail.fulfilled, (state, { payload }: PayloadAction<JobDetailRespType>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    toast.success(payload?.message);
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(deleteJobDetail.rejected, (state, { payload }: PayloadAction<JobDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export default jobDetailSlice;