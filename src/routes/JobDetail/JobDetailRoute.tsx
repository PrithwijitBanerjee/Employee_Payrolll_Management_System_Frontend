import JobDetail from "@/views/JobDetail/JobDetail";
import type React from "react";
import { Route, Routes } from "react-router-dom";

const JobDetailRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/manage" element={<JobDetail />} />
            </Routes>
        </>
    );
};

export default JobDetailRoute;