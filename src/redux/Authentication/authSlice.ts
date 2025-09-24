import type { UserSignInCredentialsType, UserSignInResponse, UserSignUpCredentialsType, UserSignUpResponse, UserSlice } from "@/@types/auth";
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";
import { STATUES } from "@/utils/Status";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: UserSlice = {
    isLoggedIn: false,
    status: STATUES.IDLE,
    error: null,
    token: null,
    userData: null,
    redirectReg: null,
    redirectTo: null,
};

export const signUpUser = createAsyncThunk<UserSignUpResponse, UserSignUpCredentialsType>("user/signUp/Job", async (credentials, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<UserSignUpResponse>(Endpoints.register, {
            ...credentials,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const signInUser = createAsyncThunk<UserSignInResponse, UserSignInCredentialsType>("user/signIn/Job", async (credentials, { rejectWithValue }) => {
    try {
        const res = await HttpClients.postRequest<UserSignInResponse>(Endpoints.login, {
            ...credentials,
        });
        return res;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logoutUser: state => {
            state.isLoggedIn = false;
            state.userData = null;
            state.token = null;
            state.error = null;
            state.redirectReg = null;
            state.redirectTo = null;
            state.status = STATUES.IDLE;
            toast.success("User has been signed out successfully");
        },
        clear_log: state => {
            state.redirectReg = null;
            state.redirectTo = null;
        },
    }, // Required property
    extraReducers: builder => {
        builder
            .addCase(signUpUser.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.redirectReg = null;
            })
            .addCase(signUpUser.fulfilled, (state, action: PayloadAction<UserSignUpResponse>) => {
                if (action.payload.status && typeof action.payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    // state.token = action.payload.data.token;
                    state.userData = action.payload.data.user;
                    state.redirectReg = "/login";
                    toast.success(action.payload.message);
                } else {
                    state.status = STATUES.ERROR;
                    state.error = action.payload.error || null;
                    state.redirectReg = null;
                    toast.error(action.payload.message || "User registration failed!!!");
                }
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.status = STATUES.ERROR;
                state.token = null;
                state.redirectReg = null;
                // Type-safe handling of unknown payload
                if (action.payload instanceof Error) {
                    state.error = action.payload.message;
                    toast.error(action.payload.message);
                } else if (action.payload && typeof action.payload === "object" && "message" in action.payload) {
                    state.error = (action.payload as any).message;
                    toast.error((action.payload as any).message);
                } else {
                    state.error = action.error.message || "Unknown error";
                    toast.error(action.error.message || "User registration failed!!!");
                }
            })

            .addCase(signInUser.pending, state => {
                state.status = STATUES.LOADING;
                state.error = null;
                state.redirectTo = null;
                state.isLoggedIn = false;
            })
            .addCase(signInUser.fulfilled, (state, action: PayloadAction<UserSignUpResponse>) => {
                if (action.payload.status && typeof action.payload.status === "boolean") {
                    state.status = STATUES.IDLE;
                    state.error = null;
                    state.token = action.payload.data.token;
                    state.userData = action.payload.data.user;
                    state.redirectTo = "/";
                    state.isLoggedIn = true;
                    toast.success(action.payload.message || "User login success");
                } else {
                    state.status = STATUES.ERROR;
                    state.error = action.payload.error || null;
                    toast.error(action.payload.message || "User login failed!!!");
                    state.redirectTo = null;
                    state.isLoggedIn = false;
                }
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.status = STATUES.ERROR;
                state.redirectTo = null;
                state.token = null;
                state.isLoggedIn = false;
                // Type-safe handling of unknown payload
                if (action.payload instanceof Error) {
                    state.error = action.payload.message;
                    toast.error(action.payload.message);
                } else if (action.payload && typeof action.payload === "object" && "message" in action.payload) {
                    state.error = (action.payload as any).message;
                    toast.error((action.payload as any).message);
                } else {
                    state.error = action.error.message || "Unknown error";
                    toast.error(action.error.message || "User login failed!!!");
                }
            });
    }
});

export const { logoutUser, clear_log } = authSlice.actions;
export default authSlice;