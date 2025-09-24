import type React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "@/views/Auth/Registration";
import Layout from "@/components/commons/Layout";
import Dashboard from "@/views/Dashboard/Dashboard";
import Login from "@/views/Auth/Login";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoutes from "@/routes/Roles/RoleRoutes";

const ProjectRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/register" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<Layout />}>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Dashboard />} />

                        {/* ...All Role related Route defined here ... */}
                        <Route path="/role/*" element={<RoleRoutes />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default ProjectRoutes;