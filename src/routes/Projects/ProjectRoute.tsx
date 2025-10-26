import type React from "react";
import { Route, Routes } from "react-router-dom";
import ProjectForm from "@/views/Project/ProjectForm";
import Projects from "@/views/Project/Projects";

const ProjectRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/add" element={<ProjectForm />} />
                <Route path="/view" element={<Projects />} />
                <Route path="/update/:id/:isEdit" element={<ProjectForm />} />
            </Routes>
        </>
    );
};

export default ProjectRoute;