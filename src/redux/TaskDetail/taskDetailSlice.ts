import type { TaskDetailRespType, TaskDetailSlice, TASKINPTYPE, UpdateTaskDetailType } from "@/@types/task";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: TaskDetailSlice = {
    status: STATUES.IDLE,
    error: null,
    taskDetail: null,
    taskDetails: [],
};

export const getAllManagedTaskDetails = createAsyncThunk<TaskDetailRespType, void>("user/managedTaskDetails/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<TaskDetailRespType>(Endpoints.getManagedTasks);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllAllotedTaskDetails = createAsyncThunk<TaskDetailRespType, void>("user/allotedTaskDetails/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<TaskDetailRespType>(Endpoints.getAllotedTasks);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllTaskDetails = createAsyncThunk<TaskDetailRespType, void>("user/taskDetails/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<TaskDetailRespType>(Endpoints.getAllTasks);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getTaskDetailById = createAsyncThunk<TaskDetailRespType, string>("user/taskDetails/fetch/:id/Job", async (taskDetailId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<TaskDetailRespType>(`${Endpoints.getTaskByCode}/${taskDetailId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addTaskDetail = createAsyncThunk<TaskDetailRespType, TASKINPTYPE>("user/taskDetails/add/Job", async (taskDetailData, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<TaskDetailRespType>(Endpoints.createTask, taskDetailData);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateTaskDetail = createAsyncThunk<TaskDetailRespType, UpdateTaskDetailType>("user/taskDetails/update/:id/Job", async ({ id, ...taskDetailData }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<TaskDetailRespType>(`${Endpoints.updateTask}/${id}`, {
            ...taskDetailData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const rescheduleTaskDetail = createAsyncThunk<TaskDetailRespType, UpdateTaskDetailType>("user/rescheduleTaskDetails/update/:id/Job", async ({ id, ...taskDetailData }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<TaskDetailRespType>(`${Endpoints.addManageTask}/${id}`, {
            ...taskDetailData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteTaskDetail = createAsyncThunk<TaskDetailRespType, string | number>("user/taskDetails/delete/:id/Job", async (taskDetailId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.deleteRequest<TaskDetailRespType>(`${Endpoints.deleteTask}/${taskDetailId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const taskDetailSlice = createSlice({
    name: "taskDetail",
    initialState,
    reducers: {}, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllTaskDetails.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.taskDetails = [];
            })
            .addCase(getAllTaskDetails.fulfilled, (state, { payload }: PayloadAction<TaskDetailRespType>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.taskDetails = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.taskDetails = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllTaskDetails.rejected, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.taskDetails = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getTaskDetailById.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.taskDetail = null;
            })
            .addCase(getTaskDetailById.fulfilled, (state, { payload }: PayloadAction<TaskDetailRespType>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.taskDetail = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.taskDetail = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getTaskDetailById.rejected, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.taskDetail = null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(addTaskDetail.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(addTaskDetail.fulfilled, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    toast.success(payload?.message || "Task Detail added successfully");
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(addTaskDetail.rejected, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(updateTaskDetail.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateTaskDetail.fulfilled, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    toast.success(payload?.message || "Task has been updated successfully");
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(updateTaskDetail.rejected, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(deleteTaskDetail.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(deleteTaskDetail.fulfilled, (state, { payload }: PayloadAction<TaskDetailRespType>) => {
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
            .addCase(deleteTaskDetail.rejected, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getAllAllotedTaskDetails.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.taskDetails = [];
            })
            .addCase(getAllAllotedTaskDetails.fulfilled, (state, { payload }: PayloadAction<TaskDetailRespType>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.taskDetails = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.taskDetails = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllAllotedTaskDetails.rejected, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.taskDetails = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getAllManagedTaskDetails.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.taskDetails = [];
            })
            .addCase(getAllManagedTaskDetails.fulfilled, (state, { payload }: PayloadAction<TaskDetailRespType>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.taskDetails = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.taskDetails = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllManagedTaskDetails.rejected, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.taskDetails = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(rescheduleTaskDetail.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(rescheduleTaskDetail.fulfilled, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                if (payload.success && typeof payload.success === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    // toast.success(payload?.message || "Task has been updated successfully");
                    toast.success("Task has been rescheduled successfully");
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(rescheduleTaskDetail.rejected, (state, { payload }: PayloadAction<TaskDetailRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export default taskDetailSlice;