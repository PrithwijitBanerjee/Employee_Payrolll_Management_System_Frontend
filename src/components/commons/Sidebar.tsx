import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "@/images/Employee_JOB_Image_Logo.jpg";
// import LogoutModal from "../components/modal/LogoutModal";
// import { logoutCleanUp } from "../utils/logoutCleanUp";

function Sidebar() {
    // const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

    const toggleLogoutModal = (): void => {
        setShowLogoutModal(!showLogoutModal);
    };

    // const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    //     e.preventDefault();
    //     toggleLogoutModal();
    //     // logoutCleanUp();
    //     navigate("/login");
    // };

    const handlClick = (): void => {
        const sidebar = document.querySelector(".sidebarwrap");
        if (sidebar) {
            sidebar.classList.remove("show");
        }
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
                            <img src={logo} alt="No Image ..." width={50} height={50}/>
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

                        {/* Category */}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead6">
                                <Link to="#"
                                    className="btn btn-header-link"
                                    data-toggle="collapse"
                                    data-target="#sidemenu6"
                                    aria-expanded="true"
                                    aria-controls="sidemenu6"
                                >
                                    <i className="fa-solid fa-tags"></i>
                                    <span>Category</span>
                                </Link>
                            </div>
                            <div
                                id="sidemenu6"
                                className="collapse"
                                aria-labelledby="sidemenuhead6"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/category" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Category</NavLink></li>
                                    <li><NavLink to="/add-category" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Category</NavLink></li>
                                </ul>
                            </div>
                        </li>

                        {/***Menu 2 For Logo ***/}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead1">
                                <Link to="#"
                                    className="btn btn-header-link"
                                    data-toggle="collapse"
                                    data-target="#sidemenu1"
                                    aria-expanded="true"
                                    aria-controls="sidemenu1"
                                >
                                    <i className="fa-solid fa-image"></i>
                                    <span>Logo</span>
                                </Link>
                            </div>
                            <div
                                id="sidemenu1"
                                className="collapse"
                                aria-labelledby="sidemenuhead1"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/logo" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Logo</NavLink></li>
                                    <li><NavLink to="/logo-form" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Logo</NavLink></li>
                                </ul>
                            </div>
                        </li>

                        {/***Menu 3 For Theme ***/}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead2">
                                <Link to="#"
                                    className="btn btn-header-link"
                                    data-toggle="collapse"
                                    data-target="#sidemenu2"
                                    aria-expanded="true"
                                    aria-controls="sidemenu2"
                                >
                                    <i className="fa-solid fa-paintbrush"></i>
                                    <span>Theme</span>
                                </Link>
                            </div>
                            <div
                                id="sidemenu2"
                                className="collapse"
                                aria-labelledby="sidemenuhead2"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/theme" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Theme</NavLink></li>
                                    <li><NavLink to="/theme-form" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Theme</NavLink></li>
                                </ul>
                            </div>
                        </li>

                        {/***Menu 4 For Partner Logo ***/}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead3">
                                <Link to="#"
                                    className="btn btn-header-link"
                                    data-toggle="collapse"
                                    data-target="#sidemenu3"
                                    aria-expanded="true"
                                    aria-controls="sidemenu3"
                                >
                                    <i className="fa-solid fa-image"></i>
                                    <span>Partner Logo</span>
                                </Link>
                            </div>
                            <div
                                id="sidemenu3"
                                className="collapse"
                                aria-labelledby="sidemenuhead3"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/partner-logo" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Partner Logo</NavLink></li>
                                    <li><NavLink to="/add-partner-logo" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Partner Logo</NavLink></li>
                                </ul>
                            </div>
                        </li>

                        {/***Menu 5 For Badge ***/}
                        <li className="menuline">
                            <div className="menu-head" id="sidemenuhead4">
                                <Link to="#"
                                    className="btn btn-header-link"
                                    data-toggle="collapse"
                                    data-target="#sidemenu4"
                                    aria-expanded="true"
                                    aria-controls="sidemenu4"
                                >
                                    <i className="fa-solid fa-medal"></i>
                                    <span>Badge</span>
                                </Link>
                            </div>
                            <div
                                id="sidemenu4"
                                className="collapse"
                                aria-labelledby="sidemenuhead4"
                                data-parent="#sidemenu"
                            >
                                <ul className="Submenu">
                                    <li><NavLink to="/badge" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Manage Badge</NavLink></li>
                                    <li><NavLink to="/add-badge" onClick={handlClick}><i className="fa-solid fa-angles-right mr-2"></i>Add Badge</NavLink></li>
                                </ul>
                            </div>
                        </li>

                        {/***Menu 6 For Pilliar ***/}
                        <li className="menuline">
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
                        <li className="menuline">
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
                        <li className="menuline">
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
            {/* {showLogoutModal && <LogoutModal toggleLogoutModal={toggleLogoutModal} handleLogout={handleLogout} />} */}
        </>
    );
};

export default Sidebar;