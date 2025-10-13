import type { ProjectHelpSlice, ProjectHelpResp, ProjectHelpInpType, UpdateProjectHelpInpType } from "@/@types/projectHelp";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: ProjectHelpSlice = {
    status: STATUES.IDLE,
    error: null,
    projectHelp: null,
    projectHelps: [],
};

export const getAllProjectHelps = createAsyncThunk<ProjectHelpResp, void>("user/projectHelp/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<ProjectHelpResp>(Endpoints.getProjectHelp);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getProjectHelpById = createAsyncThunk<ProjectHelpResp, string>("user/projectHelp/fetch/:id/Job", async (projectHelpId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<ProjectHelpResp>(`${Endpoints.getProjectHelpById}/${projectHelpId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getProjectHelpByTag = createAsyncThunk<ProjectHelpResp, string>("user/projectHelpByTag/fetch/:tag/Job", async (projectHelpTag, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<ProjectHelpResp>(`${Endpoints.getProjectHelpByTag}/${projectHelpTag}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addProjectHelp = createAsyncThunk<ProjectHelpResp, ProjectHelpInpType>("user/projectHelp/add/Job", async (projectHelpData, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<ProjectHelpResp>(Endpoints.addProjectHelp, {
            ...projectHelpData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateProjectHelp = createAsyncThunk<ProjectHelpResp, UpdateProjectHelpInpType>("user/projectHelp/update/:id/Job", async ({ id, data, tag }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<ProjectHelpResp>(`${Endpoints.updateProjectHelp}/${id}`, {
            data,
            tag,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteProjectHelp = createAsyncThunk<ProjectHelpResp, string>("user/projectHelp/delete/:id/Job", async (projectHelpId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.deleteRequest<ProjectHelpResp>(`${Endpoints.delProjectHelp}/${projectHelpId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const projectHelpSlice = createSlice({
    name: "projectHelp",
    initialState,
    reducers: {}, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllProjectHelps.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.projectHelps = [];
            })
            .addCase(getAllProjectHelps.fulfilled, (state, { payload }: PayloadAction<ProjectHelpResp>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.projectHelps = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.projectHelps = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllProjectHelps.rejected, (state, { payload }: PayloadAction<ProjectHelpResp | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.projectHelps = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getProjectHelpById.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.projectHelp = null;
            })
            .addCase(getProjectHelpById.fulfilled, (state, { payload }: PayloadAction<ProjectHelpResp>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.projectHelp = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.projectHelp = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getProjectHelpById.rejected, (state, { payload }: PayloadAction<ProjectHelpResp | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.projectHelp = null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getProjectHelpByTag.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.projectHelps = [];
            })
            .addCase(getProjectHelpByTag.fulfilled, (state, { payload }: PayloadAction<ProjectHelpResp>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.projectHelps = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.projectHelps = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getProjectHelpByTag.rejected, (state, { payload }: PayloadAction<ProjectHelpResp | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.projectHelps = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(addProjectHelp.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(addProjectHelp.fulfilled, (state, { payload }: PayloadAction<ProjectHelpResp>) => {
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
            .addCase(addProjectHelp.rejected, (state, { payload }: PayloadAction<ProjectHelpResp | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(updateProjectHelp.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateProjectHelp.fulfilled, (state, { payload }: PayloadAction<ProjectHelpResp>) => {
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
            .addCase(updateProjectHelp.rejected, (state, { payload }: PayloadAction<ProjectHelpResp | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(deleteProjectHelp.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(deleteProjectHelp.fulfilled, (state, { payload }: PayloadAction<ProjectHelpResp>) => {
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
            .addCase(deleteProjectHelp.rejected, (state, { payload }: PayloadAction<ProjectHelpResp | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export default projectHelpSlice;