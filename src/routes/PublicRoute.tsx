import React from "react";
import { useAppSelector } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute: React.FC = () => {
    const { isLoggedIn } = useAppSelector(state => state.auth);
    return (
        !isLoggedIn ?
            <>
                <Outlet />
            </> :
            <Navigate to={"/"} />
    );
};

export default PublicRoute;