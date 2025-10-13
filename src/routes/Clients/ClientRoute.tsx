import type React from "react";
import { Route, Routes } from "react-router-dom";
import ClientForm from "@/views/Client/ClientForm";
import Clients from "@/views/Client/Clients";

const ClientRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/add" element={<ClientForm />} />
                <Route path="/view" element={<Clients />} />
                <Route path="/update/:id/:isEdit" element={<ClientForm />} />
            </Routes>
        </>
    );
};

export default ClientRoute;