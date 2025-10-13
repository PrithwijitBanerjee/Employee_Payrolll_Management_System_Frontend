import type { ClientInpType, ClientRespType, ClientSlice, UpdateClientType } from "@/@types/client";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: ClientSlice = {
    status: STATUES.IDLE,
    error: null,
    client: null,
    clients: [],
};

export const getAllClients = createAsyncThunk<ClientRespType, void>("user/clients/fetch/Job", async (_, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<ClientRespType>(Endpoints.getAllClients);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getClientById = createAsyncThunk<ClientRespType, string>("user/client/fetch/:id/Job", async (clientCode, { rejectWithValue }) => {
    try {
        const res = await HttpClients.getRequest<ClientRespType>(`${Endpoints.getClientByCode}/${clientCode}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addClient = createAsyncThunk<ClientRespType, ClientInpType>("user/client/add/Job", async (clientData, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<ClientRespType>(Endpoints.addClient, {
            ...clientData,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateClient = createAsyncThunk<ClientRespType, UpdateClientType>("user/client/update/:id/Job", async ({ id, ClientName, ClientStatus }, { rejectWithValue }) => {
    try {
        const res = await HttpClients.putRequest<ClientRespType>(`${Endpoints.updateClient}/${id}`, {
            ClientName,
            ClientStatus,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteClient = createAsyncThunk<ClientRespType, string>("user/client/delete/:id/Job", async (clientId, { rejectWithValue }) => {
    try {
        const res = await HttpClients.deleteRequest<ClientRespType>(`${Endpoints.deleteClient}/${clientId}`);
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {}, // Required property
    extraReducers: builder => {
        builder
            .addCase(getAllClients.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.clients = [];
            })
            .addCase(getAllClients.fulfilled, (state, { payload }: PayloadAction<ClientRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.clients = payload.data || [];
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.clients = [];
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getAllClients.rejected, (state, { payload }: PayloadAction<ClientRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.clients = [];
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(getClientById.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.client = null;
            })
            .addCase(getClientById.fulfilled, (state, { payload }: PayloadAction<ClientRespType>) => {
                if (payload.status && typeof payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.client = payload.data || null;
                } else {
                    state.status = STATUES.ERROR;
                    state.error = payload.message || null;
                    state.client = null;
                    toast.error(payload.message || "Something Went Wrong!!!");
                }
            })
            .addCase(getClientById.rejected, (state, { payload }: PayloadAction<ClientRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                state.client = null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(addClient.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(addClient.fulfilled, (state, { payload }: PayloadAction<ClientRespType | any>) => {
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
            .addCase(addClient.rejected, (state, { payload }: PayloadAction<ClientRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })
            .addCase(updateClient.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(updateClient.fulfilled, (state, { payload }: PayloadAction<ClientRespType | any>) => {
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
            .addCase(updateClient.rejected, (state, { payload }: PayloadAction<ClientRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            })

            .addCase(deleteClient.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
            })
            .addCase(deleteClient.fulfilled, (state, { payload }: PayloadAction<ClientRespType>) => {
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
            .addCase(deleteClient.rejected, (state, { payload }: PayloadAction<ClientRespType | any>) => {
                state.status = STATUES.ERROR;
                state.error = payload?.message || null;
                toast.error(payload.message || "Something Went Wrong!!!");
            });
    }
});

export default clientSlice;