import React from "react";
import Header from "@/components/commons/Header";
import Footer from "@/components/commons/Footer";
import { Outlet } from "react-router-dom";

const Layout: React.FC = (): React.ReactElement => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;