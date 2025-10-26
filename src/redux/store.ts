import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "@/redux/Authentication/authSlice";
import roleSlice from "./Roles/roleSlice";
import projectHelpSlice from "./ProjectHelp/projectHelpSlice";
import departmentSlice from "./Departments/departmentSlice";
import designationSlice from "./Designations/designationSlice";
import clientSlice from "./Clients/clientSlice";
import employeeSlice from "./Employees/employeeSlice";
import projectSlice from "./Projects/projectSlice";

const persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["auth"],
};

const reducer = combineReducers({
    auth: authSlice.reducer,
    role: roleSlice.reducer,
    projectHelp: projectHelpSlice.reducer,
    department: departmentSlice.reducer,
    designation: designationSlice.reducer,
    employee: employeeSlice.reducer,
    client: clientSlice.reducer,
    project: projectSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>

type AppDispatch = typeof store.dispatch;

// custom hooks .....
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();