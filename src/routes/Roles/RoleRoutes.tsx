import type React from "react";
import { Route, Routes } from "react-router-dom";
import RoleForm from "@/views/Roles/RoleForm";
import Roles from "@/views/Roles/Roles";

const RoleRoutes: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/add" element={<RoleForm />} />
                <Route path="/view" element={<Roles />} />
                <Route path="/update/:id/:isEdit" element={<RoleForm />} />
            </Routes>
        </>
    );
};

export default RoleRoutes;