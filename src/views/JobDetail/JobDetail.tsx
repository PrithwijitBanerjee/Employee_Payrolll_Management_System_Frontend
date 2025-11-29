import type { JobDetailType } from "@/@types/jobDetails";
import type { JobMasterType } from "@/@types/jobMaster";
import type { ProjectArrType } from "@/@types/project";
import type { ProjectHelpArrType } from "@/@types/projectHelp";
import Loader from "@/components/commons/Loader";
import AssignUserModal from "@/components/JobMaster/AssignUserModal";
import DeleteModal from "@/components/modals/DeleteModal";
import { getAllClients } from "@/redux/Clients/clientSlice";
import { addJobDetail, deleteJobDetail, getAllJobDetails } from "@/redux/JobDetail/jobDetailSlice";
import { getAllJobMasters, updateJobMaster } from "@/redux/JobMaster/jobMasterSlice";
import { getProjectHelpByTag } from "@/redux/ProjectHelp/projectHelpSlice";
import { getAllProjects } from "@/redux/Projects/projectSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { STATUES } from "@/utils/Status";
import { useEffect, useState } from "react";

const INITIAL_FORM_ROW: JobDetailType = {
    id: 1,
    JobNo: "",
    JobMasterNo: "",
    ProjectCode: "",
    Particulars: "",
    ExpDelvDate: "",
    JobStatus: "",
    BasicAmount: 0,
    DiscRate: 0,
    DiscAmount: 0,
    GrossAmount: 0,
    SGSTRate: 0,
    SGSTAmount: 0,
    CGSTRate: 0,
    CGSTAmount: 0,
    IGSTRate: 0,
    IGSTAmount: 0,
    NetAmount: 0,
};

const JobDetail = () => {
    const dispatch = useAppDispatch();
    const [formRows, setFormRows] = useState<JobDetailType[]>([INITIAL_FORM_ROW]);
    const [activeTab, setActiveTab] = useState("jobMaster");
    // const { clients } = useAppSelector(state => state.client);
    const { projects } = useAppSelector(state => state.project) as { projects: ProjectArrType[] };
    const { projectHelps } = useAppSelector(state => state?.projectHelp);
    const { jobDetails, status: jobSummaryStatus } = useAppSelector(state => state.jobDetail);
    const { jobMasters, status: jobMasterStatus } = useAppSelector(state => state.jobMaster);
    const [activeProjects, setActiveProjects] = useState<ProjectArrType[] | []>([]);
    const [footerJobDashboard, setFooterJobDashboard] = useState<{
        totalJobs: number;
        completedJobs: number;
        pendingJobs: number;
        inProgressJobs: number;
    }>({
        totalJobs: 0,
        completedJobs: 0,
        pendingJobs: 0,
        inProgressJobs: 0,
    });

    // State to track the master project code
    const [masterProjectCode, setMasterProjectCode] = useState<string>("");

    useEffect(() => {
        if (jobMasters) {
            const totalJobs = jobMasters.length;
            const completedJobs = jobMasters.filter(job => job.status?.data === "Completed").length;
            const pendingJobs = jobMasters.filter(job => job.status?.data === "Pending").length;
            const inProgressJobs = jobMasters.filter(job => job.status?.data === "WIP").length;
            setFooterJobDashboard({
                totalJobs,
                completedJobs,
                pendingJobs,
                inProgressJobs,
            });
        }
    }, [jobMasters]);

    useEffect(() => {
        if (projects?.length) {
            setActiveProjects(projects?.filter((item: ProjectArrType) => item?.status?.data === "Active") ?? []);
        }
    }, [projects]);

    // State for delete confirmation modal
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<JobDetailType | null>(null);

    // State for assign user modal
    const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
    const [selectedJobMaster, setSelectedJobMaster] = useState<JobMasterType | null>(null);

    const [isEdit, setIsEdit] = useState<boolean>(false);

    // Assign user handlers
    const handleAssignClick = (jobMaster: JobMasterType) => {
        setSelectedJobMaster(jobMaster);
        setAssignModalOpen(true);
    };

    const handleAssignUser = (jobMasterCode: string | any, ClientCode: string | any) => {
        // Encode the jobMasterCode to the required format
        const encodedJobMasterCode = encodeURIComponent(jobMasterCode);

        // Here you would typically make an API call to assign the user
        // console.log(`Assigning user ${JobTo} to job ${jobMasterCode}`);
        // console.log(`Encoded job code: ${encodedJobMasterCode}`);

        dispatch(updateJobMaster({
            id: encodedJobMasterCode, // Use the encoded value here
            ClientCode,
        })).then(() => {
            // Refresh the job masters list after successful assignment
            dispatch(getAllJobMasters());
        });
        setAssignModalOpen(false);
        setSelectedJobMaster(null);
    };

    const handleAssignCancel = () => {
        setAssignModalOpen(false);
        setSelectedJobMaster(null);
    };


    // Delete confirmation handlers
    const handleDeleteClick = (item: JobDetailType) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete?.JobNo) return;

        try {
            await dispatch(deleteJobDetail(itemToDelete.JobNo)).unwrap();
            // Refresh the job details list after successful deletion
            dispatch(getAllJobDetails());
        } catch (error) {
            console.error("Failed to delete job detail:", error);
        } finally {
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    useEffect(() => {
        dispatch(getAllClients());
        dispatch(getAllProjects());
        dispatch(getProjectHelpByTag("02"));
    }, [dispatch]);

    // Add this function to handle project selection
    const handleProjectChange = (id: string | number, projectCode: string) => {
        if (!projectCode) {
            // Clear GST rates if no project is selected
            handleInputChange(id, "SGSTRate", 0);
            handleInputChange(id, "CGSTRate", 0);
            handleInputChange(id, "IGSTRate", 0);
            return;
        }

        // Find the selected project
        const selectedProject: ProjectArrType | undefined = projects.find((project: ProjectArrType) =>
            (project as ProjectArrType).ProjectCode === projectCode
        );

        if (selectedProject?.SGSTRate) {
            // Update the form with project's GST rates
            setFormRows(prev => prev.map(row => {
                if (String(row.id) === String(id)) {
                    return {
                        ...row,
                        SGSTRate: parseFloat(selectedProject.SGSTRate) || 0,
                        CGSTRate: parseFloat(selectedProject.CGSTRate) || 0,
                        IGSTRate: parseFloat(selectedProject.IGSTRate) || 0
                    };
                }
                return row;
            }));
        }
    };
    const addFormRow = () => {
        const newRow = {
            ...INITIAL_FORM_ROW,
            id: Date.now(),
            // Auto-populate ProjectCode from master if available
            ProjectCode: masterProjectCode || ""
        };

        setFormRows(prev => {
            const updatedRows = [...prev, newRow];

            // If master project code exists and we have projects data, auto-populate GST rates for the new row
            if (masterProjectCode && projects?.length > 0) {
                const selectedProject: ProjectArrType | undefined = projects.find((project: ProjectArrType) =>
                    (project as ProjectArrType).ProjectCode === masterProjectCode
                );

                if (selectedProject?.SGSTRate) {
                    const lastRowIndex = updatedRows.length - 1;
                    updatedRows[lastRowIndex] = {
                        ...updatedRows[lastRowIndex],
                        SGSTRate: parseFloat(selectedProject.SGSTRate) || 0,
                        CGSTRate: parseFloat(selectedProject.CGSTRate) || 0,
                        IGSTRate: parseFloat(selectedProject.IGSTRate) || 0
                    };
                }
            }

            return updatedRows;
        });
    };

    const removeFormRow = (id: string | number) => {
        if (formRows.length > 1) {
            setFormRows(prev => prev.filter(row => String(row.id) !== String(id)));

            // If removing the first row and there are other rows, update master project code
            if (String(formRows[0].id) === String(id) && formRows.length > 1) {
                setMasterProjectCode(formRows[1].ProjectCode || "");
            }
        }
    };

    // Enhanced handleInputChange to include project change handling and master project code tracking
    const handleInputChange = (id: string | number, field: keyof JobDetailType, value: string | number) => {
        setFormRows(prev => prev.map(row => {
            if (String(row.id) === String(id)) {
                const updatedRow = { ...row, [field]: value };

                // If ProjectCode is being changed in the first row, update master project code and propagate to all rows
                if (field === "ProjectCode" && String(row.id) === String(formRows[0].id)) {
                    setMasterProjectCode(value as string);

                    // Auto-populate ProjectCode and GST rates for all other rows
                    if (formRows.length > 1 && value) {
                        setTimeout(() => {
                            setFormRows(currentRows => {
                                const selectedProject: ProjectArrType | undefined = projects.find((project: ProjectArrType) =>
                                    (project as ProjectArrType).ProjectCode === value
                                );

                                return currentRows.map((r, index) => {
                                    if (index === 0) {
                                        return updatedRow;
                                    } else {
                                        const updatedSubRow = {
                                            ...r,
                                            ProjectCode: value as string
                                        };

                                        // Also update GST rates for subsequent rows
                                        if (selectedProject?.SGSTRate) {
                                            return {
                                                ...updatedSubRow,
                                                SGSTRate: parseFloat(selectedProject.SGSTRate) || 0,
                                                CGSTRate: parseFloat(selectedProject.CGSTRate) || 0,
                                                IGSTRate: parseFloat(selectedProject.IGSTRate) || 0
                                            };
                                        }

                                        return updatedSubRow;
                                    }
                                });
                            });
                        }, 0);
                    }
                }

                // If ProjectCode is being changed in any row, trigger GST rate update
                if (field === "ProjectCode") {
                    // Use setTimeout to ensure state is updated before calculating GST
                    setTimeout(() => {
                        handleProjectChange(id, value as string);
                    }, 0);
                }

                return updatedRow;
            }
            return row;
        }));
    };

    // Enhanced calculation effect
    useEffect(() => {
        const updatedRows = formRows.map(row => {
            const basicAmount: number = Number(row.BasicAmount) || 0;
            const discRate: number = Number(row.DiscRate) || 0;
            const discAmount: number = Number(row.DiscAmount) || 0;

            // Calculate discount amount based on discount rate if it's not zero
            let calculatedDiscAmount = discAmount;
            if (discRate > 0) {
                calculatedDiscAmount = (basicAmount * discRate) / 100;
            }

            // Calculate gross amount (basic amount - discount)
            const grossAmount: number = basicAmount - calculatedDiscAmount;

            // Calculate GST amounts
            const sgstRate: number = Number(row.SGSTRate) || 0;
            const cgstRate: number = Number(row.CGSTRate) || 0;
            const igstRate: number = Number(row.IGSTRate) || 0;

            const sgstAmount: number = (grossAmount * sgstRate) / 100;
            const cgstAmount: number = (grossAmount * cgstRate) / 100;
            const igstAmount: number = (grossAmount * igstRate) / 100;

            // Calculate net amount
            const netAmount: number = grossAmount + sgstAmount + cgstAmount + igstAmount;

            return {
                ...row,
                DiscAmount: calculatedDiscAmount,
                GrossAmount: grossAmount,
                SGSTAmount: sgstAmount,
                CGSTAmount: cgstAmount,
                IGSTAmount: igstAmount,
                NetAmount: netAmount
            };
        });

        setFormRows(updatedRows);
    }, [formRows.map(row =>
        `${row.BasicAmount}-${row.DiscRate}-${row.DiscAmount}-${row.SGSTRate}-${row.CGSTRate}-${row.IGSTRate}`
    ).join()]);

    useEffect(() => {
        if (activeTab === "jobSummary") {
            dispatch(getAllJobDetails());
        }
        if (activeTab === "jobMaster") {
            dispatch(getAllJobMasters());
        }
    }, [activeTab]);

    useEffect(() => {
        if (projectHelps) {
            setFormRows(prevRows => {
                return prevRows.map(row => {
                    const matchedHelp = (projectHelps as ProjectHelpArrType[]).find((help) => help.data === "Pending");
                    if (matchedHelp) {
                        return { ...row, JobStatus: matchedHelp.code };
                    }
                    return row;
                });
            });
        }
    }, [projectHelps]);

    // Reset master project code when form is reset or tab changes
    useEffect(() => {
        if (formRows.length === 1 && !formRows[0].ProjectCode) {
            setMasterProjectCode("");
        }
    }, [formRows]);

    // console.log("form Data: >>>>>> ", formRows);

    return (
        <div className="container-fluid p-5 mt-5 bg-light min-vh-100">

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                itemId={itemToDelete?.JobNo || itemToDelete?.id}
                itemName={itemToDelete?.ProjectCode || "Job Detail"}
            />

            {/* Assign User Modal */}
            <AssignUserModal
                isOpen={assignModalOpen}
                onClose={handleAssignCancel}
                onAssign={handleAssignUser}
                jobMaster={selectedJobMaster}
            />

            {/* Header Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body py-3">
                            <h2 className="h4 mb-0 text-primary">
                                <i className="fa-solid fa-user-shield me-2"></i>
                                <span className="mx-2">Job Management System</span>
                            </h2>
                            <p className="text-muted mb-0">Manage job details and track progress</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="row mb-4">
                <div className="col-12">
                    <ul className="nav nav-pills nav-fill bg-white rounded shadow-sm p-2">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "jobMaster" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTab("jobMaster");
                                    setIsEdit(false);
                                    setFormRows([INITIAL_FORM_ROW]);
                                    setMasterProjectCode("");
                                }}
                            >
                                <i className="fa-solid fa-table me-2"></i>
                                <span className="mx-2">Job Master</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "jobDetail" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTab("jobDetail");
                                    setIsEdit(false);
                                    setFormRows([INITIAL_FORM_ROW]);
                                    setMasterProjectCode("");
                                }}
                            >
                                <i className="fa-solid fa-pen-to-square me-2"></i>
                                <span className="mx-2">Job Details</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "jobSummary" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTab("jobSummary");
                                    setIsEdit(false);
                                    setFormRows([INITIAL_FORM_ROW]);
                                    setMasterProjectCode("");
                                }}
                            >
                                <i className="fa-solid fa-list-check me-2"></i>
                                <span className="mx-2">Job Summary</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Job Master Table */}
            {activeTab === "jobMaster" && (
                <div className="row mb-2">
                    {
                        jobMasterStatus === STATUES.LOADING && (<Loader />)
                    }
                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-primary text-white py-3">
                                <h5 className="card-title mb-0">
                                    <i className="fa-solid fa-table me-2"></i>
                                    <span className="mx-2">Job Master Table</span>
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive" style={{ overflow: "auto", maxHeight: "200px" }}>
                                    <table className="table table-hover table-striped mb-0" style={{ minWidth: "800px" }}>
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-4">Job No</th>
                                                <th>Job Date</th>
                                                <th>Client Code</th>
                                                <th>Basic Amount</th>
                                                <th>Disc Amount</th>
                                                <th>Gross Amount</th>
                                                <th>Tax Amount</th>
                                                <th>Net Amount</th>
                                                <th>Job Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                jobMasters?.length > 0 ? jobMasters?.map((jobMaster: JobMasterType) => (
                                                    <tr>
                                                        <td className="ps-4">
                                                            <span className="badge bg-primary">{jobMaster?.JobNo || "-"}</span>
                                                        </td>
                                                        <td>{jobMaster?.JobDate || "-"}</td>
                                                        <td><div className="d-flex align-items-center justify-content-between">
                                                            <span>{jobMaster?.ClientCode || "Not Assigned"}</span>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary ms-2"
                                                                onClick={() => handleAssignClick(jobMaster)}
                                                                title="Assign User"
                                                            >
                                                                <i className="fa-solid fa-user-plus"></i>
                                                            </button>
                                                        </div>
                                                        </td>
                                                        <td>{Number(jobMaster?.BasicAmount).toFixed(2) || "0.00"}</td>
                                                        <td>{Number(jobMaster?.DiscAmount).toFixed(2) || "0.00"}</td>
                                                        <td>{Number(jobMaster?.GrossAmount).toFixed(2) || "0.00"}</td>
                                                        <td>{Number(jobMaster?.TaxAmount).toFixed(2) || "0.00"}</td>
                                                        <td>{Number(jobMaster?.NetAmount).toFixed(2) || "0.00"}</td>
                                                        <td>
                                                            {
                                                                jobMaster?.status?.data === "WIP" ? (
                                                                    <span className="badge bg-warning">
                                                                        <i className="fa-solid fa-spinner me-1"></i>
                                                                        In Progress
                                                                    </span>
                                                                ) : jobMaster?.status?.data === "Completed" ? (
                                                                    <span className="badge bg-success">
                                                                        <i className="fa-solid fa-check me-1"></i>
                                                                        Completed
                                                                    </span>
                                                                ) : <span className="badge bg-warning">
                                                                    <i className="fa-solid fa-spinner me-1"></i>
                                                                    Pending
                                                                </span>
                                                            }
                                                        </td>
                                                    </tr>
                                                )) :
                                                    <tr>
                                                        <td colSpan={10} className="text-center text-danger">No Job Master Data Found ...</td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Detail Form */}
            {activeTab === "jobDetail" && (
                <div className="row mb-2">
                    <div className="col-12">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-gradient bg-success text-white py-3 d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0 fw-bold">
                                    <i className="fa-solid fa-pen-to-square me-2"></i>
                                    <span className="mx-2">Job Detail Form</span>
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-light btn-sm rounded-pill"
                                    onClick={addFormRow}
                                >
                                    <i className="fa-solid fa-plus me-1"></i> Add Row
                                </button>
                            </div>
                            <div className="card-body p-0">
                                {/* Form container with fixed height and vertical scroll */}
                                <div style={{
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                    padding: "1.5rem",
                                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
                                }}>
                                    <div style={{ overflowX: "auto" }}>
                                        <div style={{ minWidth: "1200px" }}>
                                            {formRows.map((row, index) => (
                                                <div key={row.id} className="form-section mb-4 p-4 border-0 rounded-3 shadow-sm bg-white position-relative">
                                                    {/* Entry Header */}
                                                    <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                                style={{ width: '40px', height: '40px' }}>
                                                                <i className="fa-solid fa-file-lines"></i>
                                                            </div>
                                                            <div>
                                                                <h6 className="text-primary mb-0 fw-bold">Entry #{index + 1}</h6>
                                                                <small className="text-muted">Job Detail Information</small>
                                                            </div>
                                                        </div>
                                                        {formRows.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger rounded-pill"
                                                                onClick={() => removeFormRow(row.id)}
                                                            >
                                                                <i className="fa-solid fa-trash me-1"></i> Remove
                                                            </button>
                                                        )}
                                                    </div>

                                                    <form>
                                                        {/* First Row - Basic Information */}
                                                        <div className="row g-4 mb-4">
                                                            {/* Project Code Dropdown */}
                                                            <div className="col-md-4">
                                                                <label htmlFor={`projectCode-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    <i className="fa-solid fa-diagram-project text-success me-1 mx-2"></i>
                                                                    Project Code
                                                                </label>
                                                                <select
                                                                    className={`form-select border-2 shadow-sm w-100 h-50 ${index > 0 ? 'bg-light' : ''}`}
                                                                    id={`projectCode-${row.id}`}
                                                                    value={row.ProjectCode}
                                                                    onChange={(e) => handleInputChange(row.id, 'ProjectCode', e.target.value)}
                                                                    disabled={index > 0 && masterProjectCode !== ""}
                                                                >
                                                                    <option value="">Select Project</option>
                                                                    {activeProjects?.length > 0 ? activeProjects?.map((project: ProjectArrType) => (
                                                                        <option key={project.ProjectCode} value={project.ProjectCode}>
                                                                            {project.ProjectName}
                                                                        </option>
                                                                    )) : <option disabled={true} value="">No Projects Available</option>}
                                                                </select>
                                                                {index > 0 && masterProjectCode !== "" && (
                                                                    <small className="text-info mt-1 d-block">
                                                                        <i className="fa-solid fa-info-circle me-1"></i>
                                                                        Project code inherited from first entry
                                                                    </small>
                                                                )}
                                                            </div>

                                                            {/* Expected Delivery Date */}
                                                            <div className="col-md-4">
                                                                <label htmlFor={`expDelvDate-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    <i className="fa-solid fa-calendar text-warning me-1 mx-2"></i>
                                                                    Exp. Delivery Date
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control border-2 shadow-sm"
                                                                    id={`expDelvDate-${row.id}`}
                                                                    value={row.ExpDelvDate}
                                                                    onChange={(e) => handleInputChange(row.id, 'ExpDelvDate', e.target.value)}
                                                                />
                                                            </div>

                                                            {/* Job Status Dropdown */}
                                                            <div className="col-md-4">
                                                                <label htmlFor={`jobStatus-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    <i className="fa-solid fa-circle-check text-info me-1 mx-2"></i>
                                                                    Job Status
                                                                </label>
                                                                <select
                                                                    className="form-select border-2 shadow-sm w-100 h-50"
                                                                    id={`jobStatus-${row.id}`}
                                                                    value={row.JobStatus}
                                                                    onChange={(e) => handleInputChange(row.id, 'JobStatus', e.target.value)}
                                                                >
                                                                    {projectHelps?.length > 0 ? projectHelps?.map((item: ProjectHelpArrType) => (
                                                                        <option key={item.code} value={item.code}>{item.data}</option>
                                                                    )) : (<option value={""} disabled={true}>No data found ...</option>)}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Rest of your form remains the same */}
                                                        {/* Second Row - Particulars and Attachment */}
                                                        <div className="row g-4 mb-4">
                                                            {/* Particulars Textarea */}
                                                            <div className="col-md-6">
                                                                <label htmlFor={`particulars-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    <i className="fa-solid fa-list text-primary me-1 mx-2"></i>
                                                                    Particulars
                                                                </label>
                                                                <textarea
                                                                    className="form-control border-2 shadow-sm"
                                                                    id={`particulars-${row.id}`}
                                                                    placeholder="Enter job particulars and description..."
                                                                    rows={3}
                                                                    value={row.Particulars}
                                                                    onChange={(e) => handleInputChange(row.id, 'Particulars', e.target.value)}
                                                                />
                                                            </div>

                                                            {/* PDF Attachment Upload */}
                                                            <div className="col-md-6">
                                                                <label htmlFor={`attachment-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    <i className="fa-solid fa-file-pdf text-danger me-1"></i>
                                                                    PDF Attachment
                                                                </label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="file"
                                                                        className="form-control border-2 shadow-sm"
                                                                        id={`attachment-${row.id}`}
                                                                        accept=".pdf"
                                                                    />
                                                                    <button className="btn btn-outline-secondary border-2" type="button">
                                                                        <i className="fa-solid fa-upload"></i>
                                                                    </button>
                                                                </div>
                                                                <small className="text-muted mt-1 d-block">
                                                                    <i className="fa-solid fa-info-circle me-1 mx-2"></i>
                                                                    Upload PDF file (Max: 10MB)
                                                                </small>
                                                            </div>
                                                        </div>

                                                        {/* Third Row - Amount Calculations */}
                                                        <div className="row g-4 mb-4">
                                                            {/* Basic Amount */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`basicAmount-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    <i className="fa-solid fa-indian-rupee-sign text-success me-1 mx-2"></i>
                                                                    Basic Amount
                                                                </label>
                                                                <div className="input-group">
                                                                    <span className="input-group-text bg-light border-2">INR</span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm"
                                                                        id={`basicAmount-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.BasicAmount}
                                                                        onChange={(e) => handleInputChange(row.id, 'BasicAmount', parseFloat(e.target.value) || 0)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Discount Rate */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`discRate-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    <i className="fa-solid fa-percent text-warning me-1 mx-2"></i>
                                                                    Discount Rate
                                                                </label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm"
                                                                        id={`discRate-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.DiscRate}
                                                                        onChange={(e) => handleInputChange(row.id, 'DiscRate', parseFloat(e.target.value) || 0)}
                                                                    />
                                                                    <span className="input-group-text bg-light border-2">%</span>
                                                                </div>
                                                            </div>

                                                            {/* Discount Amount */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`discAmount-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    <i className="fa-solid fa-tag text-info me-1 mx-2"></i>
                                                                    Discount Amount
                                                                </label>
                                                                <div className="input-group">
                                                                    <span className="input-group-text bg-light border-2">$</span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm"
                                                                        id={`discAmount-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.DiscAmount}
                                                                        readOnly={Number(row.DiscRate) > 0}
                                                                        onChange={Number(row.DiscRate) === 0 ? (e) => handleInputChange(row.id, 'DiscAmount', parseFloat(e.target.value) || 0) : undefined}
                                                                    />
                                                                </div>
                                                                {Number(row.DiscRate) > 0 && (
                                                                    <small className="text-success mt-1 d-block">
                                                                        <i className="fa-solid fa-calculator me-1 mx-2"></i>
                                                                        Calculated automatically from discount rate
                                                                    </small>
                                                                )}
                                                                {Number(row.DiscRate) === 0 && (
                                                                    <small className="text-info mt-1 d-block">
                                                                        <i className="fa-solid fa-edit me-1"></i>
                                                                        Enter discount amount manually
                                                                    </small>
                                                                )}
                                                            </div>

                                                            {/* Gross Amount */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`grossAmount-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    <i className="fa-solid fa-calculator text-primary me-1 mx-2"></i>
                                                                    Gross Amount
                                                                </label>
                                                                <div className="input-group">
                                                                    <span className="input-group-text bg-light border-2">$</span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm bg-light"
                                                                        id={`grossAmount-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.GrossAmount}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Fourth Row - GST Rates and Amounts */}
                                                        <div className="row g-4">
                                                            {/* SGST Rate */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`sgstRate-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    SGST Rate
                                                                </label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm"
                                                                        id={`sgstRate-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.SGSTRate}
                                                                        onChange={(e) => handleInputChange(row.id, 'SGSTRate', parseFloat(e.target.value) || 0)}
                                                                    />
                                                                    <span className="input-group-text bg-light border-2">%</span>
                                                                </div>
                                                            </div>

                                                            {/* SGST Amount */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`sgstAmount-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    SGST Amount
                                                                </label>
                                                                <div className="input-group">
                                                                    <span className="input-group-text bg-light border-2">$</span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm bg-light"
                                                                        id={`sgstAmount-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.SGSTAmount}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* CGST Rate */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`cgstRate-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    CGST Rate
                                                                </label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm"
                                                                        id={`cgstRate-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.CGSTRate}
                                                                        onChange={(e) => handleInputChange(row.id, 'CGSTRate', parseFloat(e.target.value) || 0)}
                                                                    />
                                                                    <span className="input-group-text bg-light border-2">%</span>
                                                                </div>
                                                            </div>

                                                            {/* CGST Amount */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`cgstAmount-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    CGST Amount
                                                                </label>
                                                                <div className="input-group">
                                                                    <span className="input-group-text bg-light border-2">$</span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm bg-light"
                                                                        id={`cgstAmount-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.CGSTAmount}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* IGST Rate */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`igstRate-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    IGST Rate
                                                                </label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm"
                                                                        id={`igstRate-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.IGSTRate}
                                                                        onChange={(e) => handleInputChange(row.id, 'IGSTRate', parseFloat(e.target.value) || 0)}
                                                                    />
                                                                    <span className="input-group-text bg-light border-2">%</span>
                                                                </div>
                                                            </div>

                                                            {/* IGST Amount */}
                                                            <div className="col-md-2">
                                                                <label htmlFor={`igstAmount-${row.id}`} className="form-label fw-semibold text-dark">
                                                                    IGST Amount
                                                                </label>
                                                                <div className="input-group">
                                                                    <span className="input-group-text bg-light border-2">$</span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 shadow-sm bg-light"
                                                                        id={`igstAmount-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.IGSTAmount}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Fifth Row - Net Amount */}
                                                        <div className="row g-4 mt-4">
                                                            {/* Net Amount */}
                                                            <div className="col-md-3">
                                                                <label htmlFor={`netAmount-${row.id}`} className="form-label fw-bold text-primary fs-6">
                                                                    <i className="fa-solid fa-calculator me-1"></i>
                                                                    Net Amount
                                                                </label>
                                                                <div className="input-group">
                                                                    <span className="input-group-text bg-primary text-white border-2 border-primary">INR</span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control border-2 border-primary bg-light fw-bold text-primary"
                                                                        id={`netAmount-${row.id}`}
                                                                        placeholder="0.00"
                                                                        step="0.01"
                                                                        min={0}
                                                                        value={row.NetAmount}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Final Save Button - Outside the scrollable area */}
                                <div className="border-top bg-light" style={{ padding: "1.5rem" }}>
                                    <div className="text-end">
                                        <button type="button" className="btn btn-outline-secondary me-2 rounded-pill px-4" onClick={(() => {
                                            setFormRows([INITIAL_FORM_ROW]);
                                            setMasterProjectCode("");
                                        })}>
                                            <i className="fa-solid fa-rotate me-1"></i> Reset All
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary rounded-pill px-4 shadow"
                                            onClick={() => {
                                                // Prepare data for API call
                                                let apiData = [];
                                                if (!isEdit) {
                                                    apiData = formRows.map(row => ({
                                                        JobMasterNo: row.JobMasterNo || "",
                                                        ProjectCode: row.ProjectCode,
                                                        Particulars: row.Particulars,
                                                        ExpDelvDate: row.ExpDelvDate,
                                                        JobStatus: row.JobStatus ? row?.JobStatus : (projectHelps as ProjectHelpArrType[])?.[0]?.code,
                                                        BasicAmount: row.BasicAmount,
                                                        DiscRate: row.DiscRate,
                                                        DiscAmount: row.DiscAmount,
                                                    }));
                                                } else {
                                                    apiData = formRows.map(row => ({
                                                        JobNo: row.JobNo,
                                                        JobMasterNo: row.JobMasterNo || "",
                                                        ProjectCode: row.ProjectCode,
                                                        Particulars: row.Particulars,
                                                        ExpDelvDate: row.ExpDelvDate,
                                                        JobStatus: row.JobStatus,
                                                        BasicAmount: row.BasicAmount,
                                                        DiscRate: row.DiscRate,
                                                        DiscAmount: row.DiscAmount,
                                                    }));
                                                }
                                                dispatch(addJobDetail(apiData)).then(() => {
                                                    setFormRows([INITIAL_FORM_ROW]); // Reset form after successful submission
                                                    setMasterProjectCode("");
                                                });
                                                if (isEdit) {
                                                    setIsEdit(false);
                                                }
                                            }}
                                        >
                                            {
                                                !isEdit ? (<><i className="fa-solid fa-floppy-disk me-1"></i> Final Save</>) :
                                                    (<><i className="fa-solid fa-pen me-1"></i> Update Save</>)
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rest of your component remains the same */}
            {/* Job Detail Table */}
            {activeTab === "jobSummary" && (
                <div className="row">
                    {
                        jobSummaryStatus === STATUES.LOADING && (<Loader />)
                    }
                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-info text-white py-3 d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">
                                    <i className="fa-solid fa-list-check me-2"></i>
                                    <span className="mx-2">Job Detail Table</span>
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div style={{ overflow: "auto", maxHeight: "300px" }}>
                                    <table className="table table-hover table-striped mb-0" style={{ minWidth: "1500px" }}>
                                        <thead className="table-light" style={{ position: "sticky", top: 0 }}>
                                            <tr>
                                                <th className="ps-4">Job.No</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>Client Name</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>Project Name</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>Particulars</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>Job Status</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>Basic Amount</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>Rate</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>Discount Amount</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>Gross Amount</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>SGST Rate</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>SGST Amt</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>CGST Rate</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>CGST Amt</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>IGST Rate</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>IGST Amt</th>
                                                <th style={{
                                                    minWidth: "150px"
                                                }}>Total Amt</th>
                                                <th className="pe-4" style={{
                                                    minWidth: "150px"
                                                }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobDetails?.length > 0 ? jobDetails?.map((item: JobDetailType, index) => (
                                                <tr key={index}>
                                                    <td className="ps-4">
                                                        {/* <span className="badge bg-secondary">{index + 1}</span> */}
                                                        <span className="badge bg-secondary">{item?.JobNo || index + 1}</span>
                                                    </td>
                                                    <td>{item?.client?.ClientName || "-"}</td>
                                                    <td>{item?.project?.ProjectName || "-"}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <i className="fa-solid fa-tag text-primary me-2"></i>
                                                            {item?.Particulars || "-"}
                                                        </div>
                                                    </td>
                                                    <td>{item?.status?.data || "-"}</td>
                                                    <td>{item?.BasicAmount || "-"}</td>
                                                    <td>{item?.DiscRate || 0}</td>
                                                    <td>{item?.DiscAmount || 0}</td>
                                                    <td>{item?.GrossAmount || 0}</td>
                                                    <td>{item?.SGSTRate || 0}</td>
                                                    <td>{item?.SGSTAmount || 0}</td>
                                                    <td>{item?.CGSTRate || 0}</td>
                                                    <td>{item?.CGSTAmount || 0}</td>
                                                    <td>{item?.IGSTRate || 0}</td>
                                                    <td>{item?.IGSTAmount || 0}</td>
                                                    <td>
                                                        <strong>{item?.NetAmount || 0}</strong>
                                                    </td>
                                                    <td className="pe-4">
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={(() => {
                                                            setIsEdit(true);
                                                            const filteredJobsByMasterCode: JobDetailType[] = jobDetails?.filter((e: JobDetailType) => e?.JobMasterNo === item?.JobMasterNo) ? jobDetails?.filter((e: JobDetailType) => e?.JobMasterNo === item?.JobMasterNo) : [];
                                                            setFormRows(filteredJobsByMasterCode);
                                                            setActiveTab("jobDetail");
                                                            // Set master project code from the first row when editing
                                                            if (filteredJobsByMasterCode.length > 0) {
                                                                setMasterProjectCode(filteredJobsByMasterCode[0].ProjectCode || "");
                                                            }
                                                        })}>
                                                            <i className="fa-solid fa-pen me-1"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger mx-2" onClick={() => handleDeleteClick(item)}>
                                                            <i className="fa-solid fa-trash me-1"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (<tr>
                                                <td colSpan={16} className="text-center text-danger">No Job Summary Data Found ...</td>
                                            </tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Stats */}
            <div className="row mt-3">
                <div className="col-12">
                    <div className="card border-0 bg-transparent">
                        <div className="card-body p-0">
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <div className="card bg-primary text-white">
                                        <div className="card-body py-3">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h6 className="card-title mb-0">Total Jobs</h6>
                                                    <h4 className="mb-0">{footerJobDashboard.totalJobs || 0}</h4>
                                                </div>
                                                <i className="fa-solid fa-briefcase fs-3"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-success text-white">
                                        <div className="card-body py-3">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h6 className="card-title mb-0">Completed</h6>
                                                    <h4 className="mb-0">{footerJobDashboard.completedJobs || 0}</h4>
                                                </div>
                                                <i className="fa-solid fa-circle-check fs-3"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-warning text-white">
                                        <div className="card-body py-3">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h6 className="card-title mb-0">In Progress</h6>
                                                    <h4 className="mb-0">{footerJobDashboard.inProgressJobs || 0}</h4>
                                                </div>
                                                <i className="fa-solid fa-spinner fs-3"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-info text-white">
                                        <div className="card-body py-3">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h6 className="card-title mb-0">Pending</h6>
                                                    <h4 className="mb-0">{footerJobDashboard.pendingJobs || 0}</h4>
                                                </div>
                                                <i className="fa-solid fa-clock fs-3"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;