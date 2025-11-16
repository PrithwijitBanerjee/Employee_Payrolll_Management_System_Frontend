import TaskDetail from "@/views/TaskDetail/TaskDetail";
import type React from "react";
import { Route, Routes } from "react-router-dom";

const TaskRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/manage" element={<TaskDetail />} />
            </Routes>
        </>
    );
};

export default TaskRoute;