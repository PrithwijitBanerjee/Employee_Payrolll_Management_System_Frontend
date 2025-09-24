import type React from "react";
import "@/components/modals/LogoutModal.css";

interface LogoutModalProps {
  toggleLogoutModal: () => void;
  handleLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ toggleLogoutModal, handleLogout }) => {
    return (
        <div className="logout-modal-overlay">
            <div className="logout-modal">
                <div className="logout-modal-content">
                    <div className="logout-icon">
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </div>
                    <h3>Are you sure you want to logout?</h3>
                    <p>You'll need to log back in to access your account.</p>
                    <div className="logout-modal-actions">
                        <button
                            className="logout-modal-cancel"
                            onClick={toggleLogoutModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="logout-modal-confirm"
                            onClick={handleLogout}
                        >
                            Yes, Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;