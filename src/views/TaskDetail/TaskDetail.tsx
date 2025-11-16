import React, { useEffect, useState } from 'react';
import type { TaskArrType, TASKINPTYPE, UpdateTaskDetailType } from '../../@types/task';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { STATUES } from '@/utils/Status';
import Loader from '@/components/commons/Loader';
import { getProjectHelpByTag } from '@/redux/ProjectHelp/projectHelpSlice';
import type { ProjectHelpArrType } from '@/@types/projectHelp';
import type { JobDetailType } from '@/@types/jobDetails';
import { addTaskDetail, deleteTaskDetail, getAllTaskDetails, getTaskDetailById, updateTaskDetail } from '@/redux/TaskDetail/taskDetailSlice';
import { getAllJobDetails } from '@/redux/JobDetail/jobDetailSlice';
import DeleteModal from '@/components/modals/DeleteModal';

const INITIAL_FORM_DATA = {
    JobNo: "",
    StartTime: "",
    EndTime: "",
    Particulars: "",
    TaskStatus: "",
};

const TaskDetail = () => {

    const [formData, setFormData] = useState<TASKINPTYPE>(INITIAL_FORM_DATA);
    const [editingIndex, setEditingIndex] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [taskToDelete, setTaskToDelete] = useState<TaskArrType | null>(null);
    
    const dispatch = useAppDispatch();
    const { taskDetail, taskDetails, status } = useAppSelector(state => state?.taskDetail);
    const { jobDetails } = useAppSelector(state => state.jobDetail);
    const { projectHelps } = useAppSelector(state => state?.projectHelp);

    useEffect(() => {
        dispatch(getProjectHelpByTag("02"));
        dispatch(getAllJobDetails());
        dispatch(getAllTaskDetails());
    }, [dispatch]);

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

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingIndex !== null) {
            // Update existing task
            const dataToEdit: UpdateTaskDetailType = {
                ...formData,
                id: encodeURIComponent(taskDetail?.TaskId as any),
            };
            dispatch(updateTaskDetail(dataToEdit)).then(() => {
                // Refresh the task detail table ...
                dispatch(getAllTaskDetails());
            });
            setEditingIndex(!editingIndex);
        } else {
            // Add new task
            const dataToSubmit = {
                ...formData,
                JobNo: formData?.JobNo ? formData?.JobNo : (jobDetails as JobDetailType[])?.[0]?.JobNo,
                TaskStatus: formData?.TaskStatus ? formData?.TaskStatus : (projectHelps as ProjectHelpArrType[])?.[0]?.code,
            };

            dispatch(addTaskDetail(dataToSubmit as TASKINPTYPE)).then(() => {
                // Refresh the task detail table ...
                dispatch(getAllTaskDetails());
            });

        }

        // Reset form
        setFormData({
            JobNo: '',
            StartTime: '',
            EndTime: '',
            Particulars: '',
            TaskStatus: '001'
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
            TaskStatus: '001'
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
                                            Job Number <span className="text-muted">(Auto-generated if empty)</span>
                                        </label>
                                        <select
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

                                    <div className="col-md-3">
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

                                    <div className="col-md-3">
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

                                    <div className="col-md-6">
                                        <label htmlFor="Particulars" className="form-label">Task Description</label>
                                        <textarea
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

                                    <div className="col-12 my-3">
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-primary">
                                                <i className="bi bi-check-circle me-2"></i>
                                                {editingIndex ? 'Update Task' : 'Create Task'}
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
                                Task List ({taskDetails.length} tasks)
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
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger mx-2"
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

export default TaskDetail;