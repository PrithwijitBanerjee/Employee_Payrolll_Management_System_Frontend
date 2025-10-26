import type React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeForm from "@/views/Employee/EmployeeForm";
import Employees from "@/views/Employee/Employees";

const EmployeeRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/add" element={<EmployeeForm />} />
                <Route path="/view" element={<Employees />} />
                <Route path="/update/:id/:isEdit" element={<EmployeeForm />} />
            </Routes>
        </>
    );
};

export default EmployeeRoute;