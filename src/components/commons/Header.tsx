import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import profileP from "../Images/profile-pic.png";
import DefaultProfile from "@/components/commons/DefaultProfile";
import { useAppDispatch, useAppSelector } from "@/redux/store";
// import { logoutCleanUp } from "../utils/logoutCleanUp";
// import LogoutModal from "../components/modal/LogoutModal";
import LogoutModal from "@/components/modals/LogoutModal";
import { logoutUser } from "@/redux/Authentication/authSlice";

interface UserData {
    email?: string;
    // Add other user data properties if needed
}

const Header = () => {
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
    const { userData } = useAppSelector(state => state?.auth);
    console.log("userData: ", userData);
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const toggleLogoutModal = (): void => {
        setShowLogoutModal(!showLogoutModal);
    };

    const handleLogout = (): void => {
        toggleLogoutModal();
        dispatch(logoutUser());
        navigate("/login");
    };

    // Safely get user data from localStorage
    const getUserEmail = (): string => {
        try {
            const userDataString = localStorage.getItem("userData");
            if (userDataString) {
                const userData: UserData = JSON.parse(userDataString);
                return userData.email || "";
            }
            return "";
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return "";
        }
    };

    const userEmail = getUserEmail();

    const isClientsActive = (path: string): boolean => {
        return location.pathname.startsWith("/" + path.split("/")[1]);
    };

    // Active state for Master Setup (underline when any sub-route is active)
    const isMasterActive = [
        "/role/add",
        "/projectHelp/add",
        "/department/add",
        "/designation/add",
        "/client/add",
        "/employee/add",
        "/jobDtl/manage",
        "/taskDtl/manage",
    ].some(p => isClientsActive(p));

    return (
        <>
            <section className="mainheader_sec">
                <button
                    className="responsive_menu"
                    id="responsiveMenu"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
                <button className="responsSearch_btn">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>

                <div className="Search_box">
                    {/* Master Setup dropdown */}
                    <div className="dropdown">
                        <Link
                            className={`dropdown-toggle ${isMasterActive ? "text_underline" : ""}`}
                            to="/"
                            id="masterSetupDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <i className="fa-solid fa-screwdriver-wrench"></i>
                            <span className="mx-2">Master Setup</span>
                        </Link>
                        <div
                            className="dropdown-menu"
                            aria-labelledby="masterSetupDropdown"
                        >
                            {
                                userData?.role === "001" ? (
                                    <>
                                        <NavLink className="dropdown-item" to="/">
                                            <i className="fa-solid fa-chart-line mr-2"></i> Dashboard
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/role/add">
                                            <i className="fa-solid fa-user-shield mr-2"></i> Role
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/projectHelp/add">
                                            <i className="fa-solid fa-circle-question mr-2"></i> Project Help
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/department/add">
                                            <i className="fa-solid fa-building mr-2"></i> Department
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/designation/add">
                                            <i className="fa-solid fa-user-tie mr-2"></i> Designation
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/client/add">
                                            <i className="fa-solid fa-users mr-2"></i> Clients
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/employee/add">
                                            <i className="fa-solid fa-landmark mr-2"></i> Employee
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/project/add">
                                            <i className="fa-solid fa-diagram-project mr-2"></i> Project
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/jobDtl/manage">
                                            <i className="fa-solid fa-briefcase mr-2"></i> Job Management
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/taskDtl/manage">
                                            <i className="fa-solid fa-list-check mr-2"></i> Task Management
                                        </NavLink>
                                    </>
                                ) : (
                                    <>
                                        <NavLink className="dropdown-item" to="/">
                                            <i className="fa-solid fa-chart-line mr-2"></i> Dashboard
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/jobDtl/manage">
                                            <i className="fa-solid fa-briefcase mr-2"></i> Job Management
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/taskDtl/manage">
                                            <i className="fa-solid fa-list-check mr-2"></i> Task Management
                                        </NavLink>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className="rightcontent d-flex">
                    <div className="actionBtn_wrap">
                        <div className="notification_btn">
                            <button className="btn">
                                <i className="fa-regular fa-bell"></i>
                            </button>
                            <div className="active">
                                <i className="fa-solid fa-circle"></i>
                            </div>
                        </div>

                        {/* account Details */}
                        <div className="Accountdetails">
                            <div className="profile_pic">
                                {/* <img src={profileP} className="img-fluid" alt="user" /> */}
                                <DefaultProfile name={userData?.EmplName || "Anonymous" as string} width={40} />
                            </div>
                            <div className="namearea">
                                <div className="dropdown">
                                    <Link
                                        className="dropdown-toggle"
                                        to="#"
                                        id="accountDropdown"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <strong>Hello {userData?.EmplName?.split(" ")?.[0] || "Anonymous"}</strong>
                                        <span>{userEmail}</span>
                                    </Link>
                                    <div
                                        className="dropdown-menu"
                                        aria-labelledby="accountDropdown"
                                    >
                                        <div>
                                            <Link
                                                className="dropdown-item"
                                                to="#"
                                                onClick={toggleLogoutModal}
                                            >
                                                <i className="fa-solid fa-right-from-bracket mr-1"></i> Log Out
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <Sidebar /> */}

            {showLogoutModal && (
                <LogoutModal
                    toggleLogoutModal={toggleLogoutModal}
                    handleLogout={handleLogout}
                />
            )}
        </>
    );
};

export default Header;