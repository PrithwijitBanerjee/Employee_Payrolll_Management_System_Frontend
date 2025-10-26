import type { ProjectInpType, ProjectRespType, ProjectSlice, UpdateProjectType } from "@/@types/project";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: ProjectSlice = {
    status: STATUES.IDLE,
    error: null,
    projects: [],
    project: null,
};

export const getAllProjects = createAsyncThunk<ProjectRespType, void>("user/projects/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<ProjectRespType>(Endpoints.getAllProjects);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getProjectById = createAsyncThunk<ProjectRespType, string>("user/project/fetch/:id/Job", async (projectId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<ProjectRespType>(`${Endpoints.getProjectById}/${projectId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addProject = createAsyncThunk<ProjectRespType, ProjectInpType>("user/project/add/Job", async (projectData, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<ProjectRespType>(Endpoints.addProject, {
            ...projectData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateProject = createAsyncThunk<ProjectRespType, UpdateProjectType>("user/project/update/:id/Job", async ({ id, ...projectData }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<ProjectRespType>(`${Endpoints.updateProject}/${id}`, {
            ...projectData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteProject = createAsyncThunk<ProjectRespType, string>("user/employee/delete/:id/Job", async (employeeId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.deleteRequest<ProjectRespType>(`${Endpoints.deleteEmployee}/${employeeId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {}, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllProjects.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.projects = [];
            })
            .addCase(getAllProjects.fulfilled, (state, { payload }: PayloadAction<ProjectRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.projects = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.projects = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllProjects.rejected, (state, { payload }: PayloadAction<ProjectRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.projects = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getProjectById.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.project = null;
            })
            .addCase(getProjectById.fulfilled, (state, { payload }: PayloadAction<ProjectRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.project = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.project = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getProjectById.rejected, (state, { payload }: PayloadAction<ProjectRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.project = null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(addProject.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(addProject.fulfilled, (state, { payload }: PayloadAction<ProjectRespType | any>) => {
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
            .addCase(addProject.rejected, (state, { payload }: PayloadAction<ProjectRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(updateProject.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, { payload }: PayloadAction<ProjectRespType | any>) => {
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
            .addCase(updateProject.rejected, (state, { payload }: PayloadAction<ProjectRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(deleteProject.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, { payload }: PayloadAction<ProjectRespType>) => {
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
            .addCase(deleteProject.rejected, (state, { payload }: PayloadAction<ProjectRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export default projectSlice;