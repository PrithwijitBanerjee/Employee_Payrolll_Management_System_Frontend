import React, { useEffect, useState } from 'react';
import type { TaskArrType, TASKINPTYPE, UpdateTaskDetailType } from '../../@types/task';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { STATUES } from '@/utils/Status';
import Loader from '@/components/commons/Loader';
import { getProjectHelpByTag } from '@/redux/ProjectHelp/projectHelpSlice';
import type { ProjectHelpArrType } from '@/@types/projectHelp';
import type { JobDetailType } from '@/@types/jobDetails';
import { deleteTaskDetail, getAllAllotedTaskDetails, getAllTaskDetails, getTaskDetailById, updateTaskDetail } from '@/redux/TaskDetail/taskDetailSlice';
import { getAllJobDetails } from '@/redux/JobDetail/jobDetailSlice';
import DeleteModal from '@/components/modals/DeleteModal';
import { getAllEmployees } from '@/redux/Employees/employeeSlice';
import toast from 'react-hot-toast';

const INITIAL_FORM_DATA = {
    JobNo: "",
    JobTo: "",
    StartTime: "",
    EndTime: "",
    Particulars: "",
    TaskStatus: "",
    Remarks: "",
    ClientCode: "",
    ProjectCode: "",
};

// Employee selection modal component
const EmployeeSelectionModal = ({
    isOpen,
    onClose,
    onSelectEmployee,
    employees
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelectEmployee: (employeeCode: string) => void;
    employees: any[];
}) => {
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");

    const handleSelect = () => {
        if (selectedEmployee) {
            onSelectEmployee(selectedEmployee);
            onClose();
            setSelectedEmployee("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className="bi bi-person-plus me-2"></i>
                            Select Employee
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="employeeSelect" className="form-label">Select Employee</label>
                            <select
                                className="form-select"
                                id="employeeSelect"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <option value="">Choose an employee...</option>
                                {employees?.map((employee) => (
                                    <option key={employee.EmplCode} value={employee.EmplCode}>
                                        {employee.EmplCode} - {employee.EmplName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSelect}>
                            Select
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AllotedTask = () => {

    const [formData, setFormData] = useState<TASKINPTYPE>(INITIAL_FORM_DATA);
    const [editingIndex, setEditingIndex] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [taskToDelete, setTaskToDelete] = useState<TaskArrType | null>(null);
    const [employeeModalOpen, setEmployeeModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const { taskDetail, taskDetails, status } = useAppSelector(state => state?.taskDetail);
    const { jobDetails } = useAppSelector(state => state.jobDetail);
    const { employees } = useAppSelector(state => state.employee);
    const { projectHelps } = useAppSelector(state => state?.projectHelp);

    useEffect(() => {
        dispatch(getProjectHelpByTag("02"));
        dispatch(getAllJobDetails());
        dispatch(getAllAllotedTaskDetails());
        dispatch(getAllEmployees());
    }, [dispatch]);

    useEffect(() => {
        if (formData?.JobNo) {
            const foundJob: JobDetailType | null | any = (jobDetails as JobDetailType[] | undefined)?.find((item: JobDetailType) => item?.JobNo === formData?.JobNo) ?? null;
            console.log("foundJob: ", foundJob);

            setFormData(prevData => ({
                ...prevData,
                ClientCode: foundJob?.job?.ClientCode ?? "",
                ProjectCode: foundJob?.ProjectCode ?? "",
            }));
        }
    }, [formData?.JobNo, jobDetails]);

    // Status options
    const statusOptions = [
        { value: '001', label: 'Pending' },
        { value: '002', label: 'In Progress' },
        { value: '003', label: 'Completed' },
        { value: '004', label: 'On Hold' }
    ];

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle employee selection from modal
    const handleEmployeeSelect = (employeeCode: string) => {
        setFormData(prev => ({
            ...prev,
            JobTo: employeeCode
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingIndex) {
            // Update existing task
            const dataToEdit: UpdateTaskDetailType = {
                JobNo: formData?.JobNo ? String(formData?.JobNo) : String((jobDetails as JobDetailType[])?.[0]?.JobNo ?? ""),
                TaskStatus: formData?.TaskStatus ? formData?.TaskStatus : (projectHelps as ProjectHelpArrType[])?.[0]?.code,
                StartTime: formData?.StartTime,
                EndTime: formData?.EndTime,
                // Particulars: formData?.Particulars,
                Remarks: formData?.Remarks,
                // JobTo: formData?.JobTo,
                id: encodeURIComponent(taskDetail?.TaskId as any),
            };
            dispatch(updateTaskDetail(dataToEdit)).then(() => {
                // Refresh the task detail table ...
                dispatch(getAllAllotedTaskDetails());
            });
            setEditingIndex(!editingIndex);
        } else {
            // Add new task
            // const dataToSubmit = {
            //     JobNo: formData?.JobNo ? String(formData?.JobNo) : String((jobDetails as JobDetailType[])?.[0]?.JobNo ?? ""),
            //     TaskStatus: formData?.TaskStatus ? formData?.TaskStatus : (projectHelps as ProjectHelpArrType[])?.[0]?.code,
            //     StartTime: formData?.StartTime,
            //     EndTime: formData?.EndTime,
            //     Particulars: formData?.Particulars,
            //     Remarks: formData?.Remarks,
            //     JobTo: formData?.JobTo,
            // };

            // dispatch(addTaskDetail(dataToSubmit as TASKINPTYPE)).then(() => {
            //     // Refresh the task detail table ...
            //     dispatch(getAllTaskDetails());
            // });
            toast.error("Please select a task before continue!!!");
        }

        // Reset form
        setFormData({
            JobNo: '',
            StartTime: '',
            EndTime: '',
            Particulars: '',
            TaskStatus: '001',
            Remarks: "",
            JobTo: "",
            ClientCode: "",
            ProjectCode: "",
        });
    };

    useEffect(() => {
        if (taskDetail) {
            setFormData({
                JobNo: taskDetail?.JobNo,
                StartTime: taskDetail?.StartTime,
                EndTime: taskDetail?.EndTime,
                Particulars: taskDetail?.Particulars,
                TaskStatus: taskDetail?.TaskStatus,
                Remarks: taskDetail?.Remarks,
                JobTo: taskDetail?.JobTo,
                ClientCode: taskDetail?.ClientCode || "",
                ProjectCode: taskDetail?.ProjectCode || "",
            });
        }
    }, [taskDetail]);

    // Edit task
    const handleEdit = (task: TaskArrType) => {
        dispatch(getTaskDetailById(encodeURIComponent(task?.TaskId)));
        setEditingIndex(true);
    };

    // Open delete confirmation modal
    const handleDeleteClick = (task: TaskArrType) => {
        setTaskToDelete(task);
        setDeleteModalOpen(true);
    };

    // Confirm delete task
    const handleConfirmDelete = async (): Promise<void> => {
        if (taskToDelete) {
            await dispatch(deleteTaskDetail(encodeURIComponent(taskToDelete.TaskId as string)));
            dispatch(getAllTaskDetails()); // Refresh the task table ...
            setDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    // Close delete modal
    const handleCloseDeleteModal = (): void => {
        setDeleteModalOpen(false);
        setTaskToDelete(null);
    };

    // Cancel edit
    const handleCancel = () => {
        setFormData({
            JobNo: '',
            StartTime: '',
            EndTime: '',
            Particulars: '',
            TaskStatus: '001',
            Remarks: "",
            JobTo: "",
            ClientCode: "",
            ProjectCode: "",
        });
        setEditingIndex(false);
    };

    // Get status label
    const getStatusLabel = (statusCode: string | any): string => {
        const status = statusOptions.find(opt => opt.value === statusCode);
        return status ? status.label : statusCode;
    };

    // Get status badge class
    const getStatusBadgeClass = (statusCode: string | any): string => {
        switch (statusCode) {
            case 'Pending': return 'bg-warning';
            case 'WIP': return 'bg-primary';
            case 'Completed': return 'bg-success';
            default: return 'bg-light text-dark';
        }
    };

    return (
        <div className="container-fluid py-4" style={{
            marginTop: "80px"
        }}>
            {
                status === STATUES.LOADING && (<Loader />)
            }

            {/* Employee Selection Modal */}
            <EmployeeSelectionModal
                isOpen={employeeModalOpen}
                onClose={() => setEmployeeModalOpen(false)}
                onSelectEmployee={handleEmployeeSelect}
                employees={employees}
            />

            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="bi bi-clipboard-plus me-2"></i>
                                {editingIndex ? 'Edit Task' : 'Create New Task'}
                            </h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="JobNo" className="form-label">
                                            Job Number
                                        </label>
                                        <select
                                            disabled={true}
                                            style={{
                                                display: "block",
                                            }}
                                            className="form-select w-100 py-1"
                                            id="JobNo"
                                            name="JobNo"
                                            value={formData.JobNo}
                                            onChange={handleInputChange}
                                        >
                                            {jobDetails?.length > 0 ? jobDetails.map((option: JobDetailType) => (
                                                <option key={option.JobNo} value={option.JobNo}>
                                                    {option.JobNo}
                                                </option>
                                            )) : (
                                                <option value={""}>No Job Data Found ...</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="JobTo" className="form-label">
                                            Job To (Employee)
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="JobTo"
                                                name="JobTo"
                                                value={formData.JobTo}
                                                onChange={handleInputChange}
                                                readOnly
                                                placeholder="Select employee..."
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary mx-2 d-none"
                                                onClick={() => setEmployeeModalOpen(true)}
                                                title="Select Employee"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-md-6 my-2">
                                        <label htmlFor="ClientCode" className="form-label">Client Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="ClientCode"
                                            name="ClientCode"
                                            value={formData.ClientCode}
                                            onChange={handleInputChange}
                                            readOnly
                                            placeholder="Client code will be auto-filled"
                                        />
                                    </div>

                                    <div className="col-md-6 my-2">
                                        <label htmlFor="ProjectCode" className="form-label">Project Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="ProjectCode"
                                            name="ProjectCode"
                                            value={formData.ProjectCode}
                                            onChange={handleInputChange}
                                            readOnly
                                            placeholder="Project code will be auto-filled"
                                        />
                                    </div>
                                    <div className="col-md-6 my-3">
                                        <label htmlFor="Particulars" className="form-label">Task Description</label>
                                        <textarea
                                            disabled={true}
                                            className="form-control"
                                            id="Particulars"
                                            name="Particulars"
                                            rows={3}
                                            value={formData.Particulars}
                                            onChange={handleInputChange}
                                            placeholder="Describe the task details..."
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 my-3">
                                        <label htmlFor="StartTime" className="form-label">Start Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            id="StartTime"
                                            name="StartTime"
                                            value={formData.StartTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-3 my-3">
                                        <label htmlFor="EndTime" className="form-label">End Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            id="EndTime"
                                            name="EndTime"
                                            value={formData.EndTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 my-3">
                                        <label htmlFor="TaskStatus" className="form-label">Task Status</label>
                                        <select
                                            style={{
                                                display: "block",
                                            }}
                                            className="form-select w-100 py-1"
                                            id="TaskStatus"
                                            name="TaskStatus"
                                            value={formData.TaskStatus}
                                            onChange={handleInputChange}
                                        >
                                            {projectHelps?.length > 0 ? projectHelps.map((option: ProjectHelpArrType) => (
                                                <option key={option.code} value={option.code}>
                                                    {option.data}
                                                </option>
                                            )) : (
                                                <option value={""}>No Status Data Found ...</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="col-md-6 my-3">
                                        <label htmlFor="Remarks" className="form-label">Remarks</label>
                                        <textarea
                                            className="form-control"
                                            id="Remarks"
                                            name="Remarks"
                                            rows={3}
                                            value={formData.Remarks}
                                            onChange={handleInputChange}
                                            placeholder="Add Task Remarks ..."
                                            required
                                        />
                                    </div>

                                    <div className="col-12 my-3">
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-primary">
                                                <i className="bi bi-check-circle me-2"></i>
                                                {editingIndex ? 'Submit Task' : 'Submit Task'}
                                            </button>
                                            {editingIndex && (
                                                <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>
                                                    <i className="bi bi-x-circle me-2"></i>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0">
                                <i className="bi bi-list-task me-2"></i>
                                All Alloted Task List ({taskDetails.length} tasks)
                            </h4>
                        </div>
                        <div className="card-body p-0">
                            {taskDetails.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-inbox display-1 text-muted"></i>
                                    <p className="mt-3 text-muted">No tasks created yet. Start by creating your first task above.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover table-striped mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">Task Id</th>
                                                <th scope="col">Job No</th>
                                                <th scope="col">Project Name</th>
                                                <th scope="col">Client Name</th>
                                                <th scope="col">Start Time</th>
                                                <th scope="col">End Time</th>
                                                <th scope="col">Duration Min</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Remarks</th>
                                                <th scope="col">Status</th>
                                                <th scope="col" className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {taskDetails.map((task: TaskArrType, index) => (
                                                <tr key={index}>
                                                    <td className="fw-bold text-primary">{task.TaskId || "-"}</td>
                                                    <td>{task.JobNo || "-"}</td>
                                                    <td>{task?.project?.ProjectName || "-"}</td>
                                                    <td>{task?.client?.ClientName || "-"}</td>
                                                    <td>{task.StartTime || "00:00"}</td>
                                                    <td>{task.EndTime || "00:00"}</td>
                                                    <td>{task.DurationMin || "0"}</td>
                                                    <td>
                                                        <div className="text-truncate" style={{ maxWidth: '200px' }} title={task.Particulars}>
                                                            {task.Particulars || "-"}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-truncate" style={{ maxWidth: '200px' }} title={task.Particulars}>
                                                            {task?.Remarks || "-"}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadgeClass(task.status?.data)}`}>
                                                            {getStatusLabel(task.status?.data)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary"
                                                                onClick={() => handleEdit(task)}
                                                                title="Edit task"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                                Start Work
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger mx-2 d-none"
                                                                onClick={() => handleDeleteClick(task)}
                                                                title="Delete task"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                itemId={taskToDelete?.TaskId}
                itemName={`Task ${taskToDelete?.TaskId}`}
            />
        </div>
    );
};

export default AllotedTask;