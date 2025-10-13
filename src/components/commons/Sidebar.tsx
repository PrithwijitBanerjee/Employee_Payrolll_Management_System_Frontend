import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "@/images/Employee_JOB_Image_Logo.jpg";
// import LogoutModal from "../components/modal/LogoutModal";
// import { logoutCleanUp } from "../utils/logoutCleanUp";
import LogoutModal from "@/components/modals/LogoutModal";
import { useAppDispatch } from "@/redux/store";
import { logoutUser } from "@/redux/Authentication/authSlice";
import type { boolean } from "yup";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const toggleLogoutModal = (): void => {
        setShowLogoutModal(!showLogoutModal);
    };

    const handleLogout = (): void => {
        toggleLogoutModal();
        // logoutCleanUp();
        dispatch(logoutUser());
        navigate("/login");
    };

    const handlClick = (): void => {
        const sidebar = document.querySelector(".sidebarwrap");
        if (sidebar) {
            sidebar.classList.remove("show");
        }
    };

    const isClientsActive = (path: string): boolean => {
        return location.pathname.startsWith("/" + path.split("/")[1]);
    };

    return (
        <>
            <section className="sidebarwrap">
                <div className="top_area">
                    <button id="backbtnsidebar" onClick={handlClick}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>

                    <div className="logo_area" style={{ borderBottom: "1px solid black", borderRadius: 0 }}>
                        <div className="logo p-2" style={{ backgroundColor: "transparent", borderRadius: "10px", color: '#AF67FF', fontWeight: 600 }}>
                            <img src={logo} alt="No Image ..." width={50} height={50} />
                        </div>
                    </div>
                </div>

                <div className="sidebar_menu">
                    <ul className="nav Menu_Nav accordion" id="sidemenu">

                        {/***Menu 1***/}
                        <li className="menuline">
                            <NavLink to="/" onClick={handlClick}>
                                <i className="fa-solid fa-bars"></i>
                                <span>Dashboard</span>
                            </NavLink>
                        </li>

                        {/* Role */}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead6">
                                <NavLink to="/role/add"
                                    // className="btn btn-header-link"
                                    className={({ isActive }) =>
                                        `btn btn-header-link ${isActive || isClientsActive("/role/add") ? "active" : ""}`
                                    }
                                    data-toggle="collapse"
                                    data-target="#sidemenu6"
                                    aria-expanded="true"
                                    aria-controls="sidemenu6"
                                >
                                    <i className="fa-solid fa-user-shield"></i>
                                    <span>Role</span>
                                </NavLink>
                            </div>
                            {/* <div
                                id="sidemenu6"
                                className="collapse d-none"
                                aria-labelledby="sidemenuhead6"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/role/view" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Role</NavLink></li>
                                    <li><NavLink to="/role/add" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Role</NavLink></li>
                                </ul>
                            </div> */}
                        </li>

                        {/***Menu 2 For Project Help ***/}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead1">
                                <NavLink to="/projectHelp/add"
                                    // className="btn btn-header-link"
                                    className={({ isActive }) =>
                                        `btn btn-header-link ${isActive || isClientsActive("/projectHelp/add") ? "active" : ""}`
                                    }
                                    data-toggle="collapse"
                                    data-target="#sidemenu1"
                                    aria-expanded="true"
                                    aria-controls="sidemenu1"
                                >
                                    <i className="fa-solid fa-circle-question"></i>
                                    <span>Project Help</span>
                                </NavLink>
                            </div>
                            {/* <div
                                id="sidemenu1"
                                className="collapse"
                                aria-labelledby="sidemenuhead1"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/projectHelp/view" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Project Help</NavLink></li>
                                    <li><NavLink to="/projectHelp/add" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Project Help</NavLink></li>
                                </ul>
                            </div> */}
                        </li>

                        {/***Menu 3 For Department ***/}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead2">
                                <NavLink to="/department/add"
                                    // className="btn btn-header-link"
                                    className={({ isActive }) =>
                                        `btn btn-header-link ${isActive || isClientsActive("/department/add") ? "active" : ""}`
                                    }
                                    data-toggle="collapse"
                                    data-target="#sidemenu2"
                                    aria-expanded="true"
                                    aria-controls="sidemenu2"
                                >
                                    <i className="fa-solid fa-building"></i>
                                    <span>Department</span>
                                </NavLink>
                            </div>
                            {/* <div
                                id="sidemenu2"
                                className="collapse"
                                aria-labelledby="sidemenuhead2"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/department/view" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Department</NavLink></li>
                                    <li><NavLink to="/department/add" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Department</NavLink></li>
                                </ul>
                            </div> */}
                        </li>

                        {/***Menu 4 For Designation ***/}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead3">
                                <NavLink to="/designation/add"
                                    className={({ isActive }) =>
                                        `btn btn-header-link ${isActive || isClientsActive("/designation/add") ? "active" : ""}`
                                    }
                                    data-toggle="collapse"
                                    data-target="#sidemenu3"
                                    aria-expanded="true"
                                    aria-controls="sidemenu3"
                                >
                                    <i className="fa-solid fa-user-tie"></i>
                                    <span>Designation</span>
                                </NavLink>
                            </div>
                            {/* <div
                                id="sidemenu3"
                                className="collapse"
                                aria-labelledby="sidemenuhead3"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/designation/view" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Designation</NavLink></li>
                                    <li><NavLink to="/designation/add" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Designation</NavLink></li>
                                </ul>
                            </div> */}
                        </li>

                        {/***Menu 5 For Clients ***/}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead4">
                                <NavLink to="/client/add"
                                    // className="btn btn-header-link"
                                    className={({ isActive }) =>
                                        `btn btn-header-link ${isActive || isClientsActive("/client/add") ? "active" : ""}`
                                    }
                                    data-toggle="collapse"
                                    data-target="#sidemenu4"
                                    aria-expanded="true"
                                    aria-controls="sidemenu4"
                                >
                                    <i className="fa-solid fa-users"></i>
                                    <span>Clients</span>
                                </NavLink>
                            </div>
                            {/* <div
                                id="sidemenu4"
                                className="collapse"
                                aria-labelledby="sidemenuhead4"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/client/view" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Clients</NavLink></li>
                                    <li><NavLink to="/client/add" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Clients</NavLink></li>
                                </ul>
                            </div> */}
                        </li>

                        {/***Menu 6 For Pilliar ***/}
                        <li className="menuline d-none">
                            <div className="menu-head" id="sidemenuhead5">
                                <Link to="#"
                                    className="btn btn-header-link"
                                    data-toggle="collapse"
                                    data-target="#sidemenu5"
                                    aria-expanded="true"
                                    aria-controls="sidemenu5"
                                >
                                    <i className="fa-solid fa-landmark"></i>
                                    <span>Pillar</span>
                                </Link>
                            </div>
                            <div
                                id="sidemenu5"
                                className="collapse"
                                aria-labelledby="sidemenuhead5"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/pilliar" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Pillars</NavLink></li>
                                    <li><NavLink to="/add-pilliar" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Pillar</NavLink></li>
                                </ul>
                            </div>
                        </li>

                        {/***Menu 7 For Features ***/}
                        <li className="menuline d-none">
                            <div className="menu-head" id="sidemenuhead6">
                                <Link to="#"
                                    className="btn btn-header-link"
                                    data-toggle="collapse"
                                    data-target="#sidemenu6"
                                    aria-expanded="true"
                                    aria-controls="sidemenu6"
                                >
                                    <i className="fa-solid fa-star"></i>
                                    <span>Features</span>
                                </Link>
                            </div>
                            <div
                                id="sidemenu6"
                                className="collapse"
                                aria-labelledby="sidemenuhead6"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/feature" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Features</NavLink></li>
                                    <li><NavLink to="/add-feature" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Features</NavLink></li>
                                </ul>
                            </div>
                        </li>

                        {/***Menu 8 For Accomodation ***/}
                        <li className="menuline d-none">
                            <div className="menu-head" id="sidemenuhead6">
                                <Link to="#"
                                    className="btn btn-header-link"
                                    data-toggle="collapse"
                                    data-target="#sidemenu7"
                                    aria-expanded="true"
                                    aria-controls="sidemenu7"
                                >
                                    <i className="fa-solid fa-hotel"></i>
                                    <span>Accomodation Module</span>
                                </Link>
                            </div>
                            <div
                                id="sidemenu7"
                                className="collapse"
                                aria-labelledby="sidemenuhead7"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/accomodation" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Accomodation Module</NavLink></li>
                                    <li><NavLink to="/add-accomodation" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Accomodation Module</NavLink></li>
                                </ul>
                            </div>
                        </li>

                    </ul>

                    <ul className="nav Account_Nav">
                        <div style={{ width: "100%" }}>
                            <Link onClick={toggleLogoutModal} to={""}>
                                <i className="fa-solid fa-right-from-bracket mr-2"></i>
                                <span>Logout</span>
                            </Link>
                        </div>
                    </ul>
                </div >
            </section >

            {/* Logout Modal */}
            {showLogoutModal && <LogoutModal
                toggleLogoutModal={toggleLogoutModal}
                handleLogout={handleLogout} />}
        </>
    );
};

export default Sidebar;