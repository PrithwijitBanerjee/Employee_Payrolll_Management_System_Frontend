import AllotedTask from "@/views/AllotedTask/AllotedTask";
import ManageTask from "@/views/ManageTask/ManageTask";
import TaskDetail from "@/views/TaskDetail/TaskDetail";
import type React from "react";
import { Route, Routes } from "react-router-dom";

const TaskRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/create" element={<TaskDetail />} />
                <Route path="/manage" element={<ManageTask />} />
                <Route path="/alloted" element={<AllotedTask />} />
            </Routes>
        </>
    );
};

export default TaskRoute;