import type { ProjectInpType } from "@/@types/project";
import type { ProjectHelpArrType } from "@/@types/projectHelp";
import Loader from "@/components/commons/Loader";
import { getProjectHelpByTag } from "@/redux/ProjectHelp/projectHelpSlice";
import { addProject, getProjectById, updateProject } from "@/redux/Projects/projectSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { STATUES } from "@/utils/Status";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";

const INITIAL_FORM_DATA: ProjectInpType = {
    ProjectName: "",
    CGSTRate: "0",
    SGSTRate: "0",
    IGSTRate: "0",
    ProjectStatus: "",
};

const ProjectForm = () => {
    const navigate = useNavigate();
    const { isEdit, id } = useParams<{ isEdit?: string; id?: string }>();

    const [formData, setFormData] = useState<ProjectInpType>(INITIAL_FORM_DATA);

    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { status, project } = useAppSelector(state => state?.project);
    const { projectHelps } = useAppSelector(state => state?.projectHelp);

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            dispatch(getProjectById(id)).then(() => {
                setLoading(false);
            });
        }
    }, [isEdit, id, dispatch]);

    useEffect(() => {
        if (isEdit && project) {
            setFormData({
                ProjectName: (project as ProjectInpType)?.ProjectName ?? "",
                CGSTRate: (project as ProjectInpType)?.CGSTRate ?? "",
                SGSTRate: (project as ProjectInpType)?.SGSTRate ?? "",
                IGSTRate: (project as ProjectInpType)?.IGSTRate ?? "",
                ProjectStatus: (project as ProjectInpType)?.ProjectStatus ?? "",
            } as ProjectInpType);
        }
    }, [isEdit, project]);

    useEffect(() => {
        dispatch(getProjectHelpByTag("01"));
    }, [dispatch]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Submit Logo
    const handleSubmit = async (e: FormEvent): Promise<void> => {
        try {
            e.preventDefault();

            if (!formData.ProjectName) {
                toast.error("Please Enter Project Name");
                return;
            }
            if (!formData.SGSTRate) {
                toast.error("Please Enter SCGST Rate");
                return;
            }
            if (!formData.CGSTRate) {
                toast.error("Please Enter CCGST Rate");
                return;
            }
            if (!formData.IGSTRate) {
                toast.error("Please Enter ICGST Rate");
                return;
            }
            if (!formData.ProjectStatus) {
                toast.error("Please Enter Project Status");
                return;
            }
            dispatch(addProject(formData));

            // Reset formData
            setFormData(INITIAL_FORM_DATA);

        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!!!");
        }
    };

    // Edit Logo
    const handleEdit = async (e: FormEvent): Promise<void> => {
        try {
            e.preventDefault();

            if (!id) {
                toast.error("Invalid Role ID");
                return;
            }
            if (!formData.ProjectName) {
                toast.error("Invalid Project Name");
                return;
            }
            if (!formData.SGSTRate) {
                toast.error("Invalid SCGST Rate");
                return;
            }
            if (!formData.CGSTRate) {
                toast.error("Invalid CCGST Rate");
                return;
            }
            if (!formData.IGSTRate) {
                toast.error("Invalid ICGST Rate");
                return;
            }
            if (!formData.ProjectStatus) {
                toast.error("Invalid Project Status");
                return;
            }

            dispatch(updateProject({
                id,
                ProjectName: formData?.ProjectName,
                ProjectStatus: formData?.ProjectStatus,
                IGSTRate: formData?.IGSTRate,
                CGSTRate: formData?.CGSTRate,
                SGSTRate: formData?.SGSTRate,
            }));
            setFormData(INITIAL_FORM_DATA);
            navigate("/project/view");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!!!");
        }
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        navigate("/project/view");
    };

    return (
        <div className='d-flex justify-content-end'>
            {status === STATUES.LOADING && <Loader />}
            {loading && <Loader />}
            <div className='form-header mx-2'>
                <section className="piechartsBox_area">
                    {!isEdit ? (
                        <div>
                            <h4 className='text-center' style={{ marginBottom: "20px" }}>
                                Add Project
                            </h4>
                            <form onSubmit={handleSubmit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Project Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Project Name</label>
                                        <input
                                            type="text"
                                            id="ProjectName"
                                            name="ProjectName"
                                            className="form-control"
                                            value={formData.ProjectName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  SGST Rate */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">SGST Rate</label>
                                        <input
                                            type="text"
                                            id="SGSTRate"
                                            name="SGSTRate"
                                            className="form-control"
                                            value={formData.SGSTRate}
                                            onChange={handleInputChange}
                                            onInput={(e: FormEvent<HTMLInputElement>) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                                            }}
                                            required
                                        />
                                    </div>

                                    {/*  IGST Rate */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">IGST Rate</label>
                                        <input
                                            type="text"
                                            id="IGSTRate"
                                            name="IGSTRate"
                                            className="form-control"
                                            value={formData.IGSTRate}
                                            onChange={handleInputChange}
                                            onInput={(e: FormEvent<HTMLInputElement>) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                                            }}
                                            required
                                        />
                                    </div>

                                    {/*  CGST Rate */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">CGST Rate</label>
                                        <input
                                            type="text"
                                            id="CGSTRate"
                                            name="CGSTRate"
                                            className="form-control"
                                            value={formData.CGSTRate}
                                            onChange={handleInputChange}
                                            onInput={(e: FormEvent<HTMLInputElement>) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                                            }}
                                            required
                                        />
                                    </div>

                                    {/*  Project Status */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Project Status</label>
                                        <select
                                            id="ProjectStatus"
                                            name="ProjectStatus"
                                            className="form-control"
                                            value={formData.ProjectStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select project status</option>
                                            {
                                                projectHelps?.length > 0 ? projectHelps?.map((item: ProjectHelpArrType) => (
                                                    <option key={item.code} value={item.code}>{item.data}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-5' style={{
                                    gap: 10
                                }}>
                                    <button type='submit' className='btn btn-outline-primary w-25'>
                                        Add Project
                                    </button>
                                    <button type='button' className='btn btn-outline-danger w-25' onClick={handleSearch}>
                                        Search
                                    </button>
                                    <button type='button' className='btn btn-outline-secondary w-25' onClick={(e) => {
                                        e.preventDefault();
                                        setFormData(INITIAL_FORM_DATA);
                                    }}>
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h4 className='text-center' style={{ marginBottom: "20px" }}>
                                Update Project 
                            </h4>
                            <form onSubmit={handleEdit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Project Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Project Name</label>
                                        <input
                                            type="text"
                                            id="ProjectName"
                                            name="ProjectName"
                                            className="form-control"
                                            value={formData.ProjectName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  SGST Rate */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">SGST Rate</label>
                                        <input
                                            type="text"
                                            id="SGSTRate"
                                            name="SGSTRate"
                                            className="form-control"
                                            value={formData.SGSTRate}
                                            onChange={handleInputChange}
                                            onInput={(e: FormEvent<HTMLInputElement>) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                                            }}
                                            required
                                        />
                                    </div>

                                    {/*  IGST Rate */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">IGST Rate</label>
                                        <input
                                            type="text"
                                            id="IGSTRate"
                                            name="IGSTRate"
                                            className="form-control"
                                            value={formData.IGSTRate}
                                            onChange={handleInputChange}
                                            onInput={(e: FormEvent<HTMLInputElement>) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                                            }}
                                            required
                                        />
                                    </div>

                                    {/*  CGST Rate */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">CGST Rate</label>
                                        <input
                                            type="text"
                                            id="CGSTRate"
                                            name="CGSTRate"
                                            className="form-control"
                                            value={formData.CGSTRate}
                                            onChange={handleInputChange}
                                            onInput={(e: FormEvent<HTMLInputElement>) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                                            }}
                                            required
                                        />
                                    </div>

                                    {/*  Project Status */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Project Status</label>
                                        <select
                                            id="ProjectStatus"
                                            name="ProjectStatus"
                                            className="form-control"
                                            value={formData.ProjectStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select project status</option>
                                            {
                                                projectHelps?.length > 0 ? projectHelps?.map((item: ProjectHelpArrType) => (
                                                    <option key={item.code} value={item.code}>{item.data}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-5'>
                                    <button type='submit' className='btn btn-outline-success w-25'>
                                        Update Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProjectForm;