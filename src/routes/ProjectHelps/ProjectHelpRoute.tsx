import type React from "react";
import { Route, Routes } from "react-router-dom";
import ProjectHelpForm from "@/views/ProjectHelp/ProjectHelpForm";
import ProjectHelps from "@/views/ProjectHelp/ProjectHelps";

const ProjectHelpRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/add" element={<ProjectHelpForm />} />
                <Route path="/view" element={<ProjectHelps />} />
                <Route path="/update/:id/:isEdit" element={<ProjectHelpForm />} />
            </Routes>
        </>
    );
};

export default ProjectHelpRoute;