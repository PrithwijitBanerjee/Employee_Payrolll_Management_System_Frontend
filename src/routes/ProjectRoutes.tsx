import type React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "@/views/Auth/Registration";
import Layout from "@/components/commons/Layout";
import Dashboard from "@/views/Dashboard/Dashboard";
import Login from "@/views/Auth/Login";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoutes from "@/routes/Roles/RoleRoutes";
import ProjectHelpRoute from "./ProjectHelps/ProjectHelpRoute";
import DepartmentRoute from "@/routes/Departments/DepartmentRoute";
import DesignationRoute from "@/routes/Designations/DesignationRoute";
import ClientRoute from "./Clients/ClientRoute";
import EmployeeRoute from "./Employees/EmployeeRoute";
import ProjectRoute from "./Projects/ProjectRoute";

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

                        {/* ...All Project Help related Route defined here ... */}
                        <Route path="/projectHelp/*" element={<ProjectHelpRoute />} />

                        {/* ...All Department related Route defined here ... */}
                        <Route path="/department/*" element={<DepartmentRoute />} />

                        {/* ...All Designation related Route defined here ... */}
                        <Route path="/designation/*" element={<DesignationRoute />} />

                        {/* ...All Client related Route defined here ... */}
                        <Route path="/client/*" element={<ClientRoute />} />

                        {/* ...All Employee related Route defined here ... */}
                        <Route path="/employee/*" element={<EmployeeRoute />} />

                        {/* ...All Project related Route defined here ... */}
                        <Route path="/project/*" element={<ProjectRoute />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default ProjectRoutes;