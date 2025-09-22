import type React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "@/views/Auth/Registration";
import Layout from "@/components/commons/Layout";
import Dashboard from "@/views/Dashboard/Dashboard";

const ProjectRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Registration />} />
                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default ProjectRoutes;