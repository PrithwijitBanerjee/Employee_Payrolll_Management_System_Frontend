import type { ClientArrType } from "@/@types/client";
import type { JobMasterType } from "@/@types/jobMaster";
import { getAllEmployees } from "@/redux/Employees/employeeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";

// Assign User Modal Component
const AssignUserModal = ({
    isOpen,
    onClose,
    onAssign,
    jobMaster
}: {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (userId: string, userName: string) => void;
    jobMaster: JobMasterType | null;
}) => {
    const [selectedUser, setSelectedUser] = useState<string>("");
    const dispatch = useAppDispatch();
    const { clients } = useAppSelector(state => state.client);
    const [selectedUserName, setSelectedUserName] = useState<string>("");

    useEffect(() => {
        dispatch(getAllEmployees());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUser) {
            const user: ClientArrType | undefined | any = clients.find((cli: ClientArrType) => cli.ClientCode === selectedUser);
            setSelectedUserName(user ? user.ClientName : "");
        }
    }, [selectedUser, clients]);

    const handleAssign = () => {
        if (selectedUser && jobMaster?.JobNo != null) {
            onAssign(String(jobMaster.JobNo), selectedUser);
            setSelectedUser("");
            onClose();
        }
    };

    useEffect(() => {
        if (jobMaster && jobMaster?.ClientCode) {
            setSelectedUser(jobMaster?.ClientCode);
        }
    }, [jobMaster]);

    const handleClose = () => {
        setSelectedUser("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title fw-bold">
                            <i className="fa-solid fa-user-plus me-2"></i>
                            Assign User to Job
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={handleClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {jobMaster && (
                            <div className="alert alert-info mb-3">
                                <div className="d-flex align-items-center">
                                    <i className="fa-solid fa-info-circle me-2"></i>
                                    <div>
                                        <strong>Job No:</strong> {jobMaster.JobNo || "N/A"}<br />
                                        <strong>Current Assignee:</strong> {selectedUserName || "Not Assigned"}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="userSelect" className="form-label fw-semibold">
                                <i className="fa-solid fa-users me-1"></i>
                                Select User to Assign:
                            </label>
                            <select
                                className="form-select border-2"
                                id="userSelect"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                            >
                                <option value="">Choose a user...</option>
                                {clients?.length > 0 ? clients.map((user: ClientArrType) => (
                                    <option key={user.ClientCode} value={user.ClientCode}>
                                        {user?.ClientName}
                                    </option>
                                )) : (
                                    <option value="" disabled={true}>No clients available ...</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-secondary rounded-pill px-4"
                            onClick={handleClose}
                        >
                            <i className="fa-solid fa-times me-1"></i>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary rounded-pill px-4"
                            onClick={handleAssign}
                            disabled={!selectedUser}
                        >
                            <i className="fa-solid fa-user-check me-1"></i>
                            Assign User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignUserModal;