import type React from "react";
import { Route, Routes } from "react-router-dom";
import Designations from "@/views/Designation/Designations";
import DesignationForm from "@/views/Designation/DesignationForm";

const DesignationRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/add" element={<DesignationForm />} />
                <Route path="/view" element={<Designations />} />
                <Route path="/update/:id/:isEdit" element={<DesignationForm />} />
            </Routes>
        </>
    );
};

export default DesignationRoute;