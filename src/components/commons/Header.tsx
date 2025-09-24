import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
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
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const toggleLogoutModal = (): void => {
        setShowLogoutModal(!showLogoutModal);
    };

    const handleLogout = (): void => {
        toggleLogoutModal();
        dispatch(logoutUser());

        // logoutCleanUp();
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
                    {/* Search form removed as per original code */}
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
                                <DefaultProfile name={userData?.name || "Anonymous" as string} width={40} />
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
                                        <strong>Hello {userData?.name?.split(" ")?.[0] || "Anonymous"}</strong>
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
            <Sidebar />

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