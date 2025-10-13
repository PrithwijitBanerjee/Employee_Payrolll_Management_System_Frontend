import type React from "react";
import { Route, Routes } from "react-router-dom";
import DepartmentForm from "@/views/Department/DepartmentForm";
import Departments from "@/views/Department/Departments";

const DepartmentRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/add" element={<DepartmentForm />} />
                <Route path="/view" element={<Departments />} />
                <Route path="/update/:id/:isEdit" element={<DepartmentForm />} />
            </Routes>
        </>
    );
};

export default DepartmentRoute;