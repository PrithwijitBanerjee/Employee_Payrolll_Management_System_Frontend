import Loader from "@/components/commons/Loader";
import { getAllDepartments } from "@/redux/Departments/departmentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { STATUES } from "@/utils/Status";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";
import { getProjectHelpByTag } from "../../redux/ProjectHelp/projectHelpSlice";
import type { ProjectHelpArrType } from "@/@types/projectHelp";
import type { EmployeeInpType } from "@/@types/employee";
import { addEmployee, getAllEmployeeTypes, getEmployeeById, updateEmployee } from "@/redux/Employees/employeeSlice";
import type { DepartmentArrType } from "@/@types/department";
import { getAllDesignations } from "@/redux/Designations/designationSlice";
import type { DesignationArrType } from "@/@types/designation";

const INITIAL_FORM_DATA: EmployeeInpType = {
    EmplName: "",
    EmplTag: "",
    EmplType: "",
    DeptCode: "",
    DesgCode: "",
    DOB: "",
    DOJ: "",
    UserID: "",
    Password: "",
    EmplStatus: "",
    Email: "",
};

const EmployeeForm = () => {
    const navigate = useNavigate();
    const { isEdit, id } = useParams<{ isEdit?: string; id?: string }>();

    const [formData, setFormData] = useState<EmployeeInpType>(INITIAL_FORM_DATA);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { projectHelps } = useAppSelector(state => state?.projectHelp);
    const { status: departmentStatus, departments } = useAppSelector(state => state?.department);
    const { status: designationStatus, designations } = useAppSelector(state => state?.designation);
    const { status, employee } = useAppSelector(state => state?.employee);
    const [employeeTypes, setEmployeeTypes] = useState<ProjectHelpArrType[] | []>([]);

    const fetchAllEmployeeTypes = async () => {
        try {
            const res = await getAllEmployeeTypes("03");
            setEmployeeTypes(res as ProjectHelpArrType[]);
        } catch (error) {
            console.log("error: ", error);
            setEmployeeTypes([]);
        }
    };

    useEffect(() => {
        dispatch(getProjectHelpByTag("01"));
        fetchAllEmployeeTypes();
        dispatch(getAllDepartments());
        dispatch(getAllDesignations());
    }, [dispatch]);

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            dispatch(getEmployeeById(id)).then(() => {
                setLoading(false);
            });
        }
    }, [isEdit, id]);

    useEffect(() => {
        if (isEdit && employee) {
            const employeeData = employee as EmployeeInpType;
            setFormData({
                EmplName: employeeData?.EmplName ?? "",
                EmplTag: employeeData?.EmplTag ?? "",
                EmplType: employeeData?.EmplType ?? "",
                DeptCode: employeeData?.DeptCode ?? "",
                DesgCode: employeeData?.DesgCode ?? "",
                DOB: employeeData?.DOB ?? "",
                DOJ: employeeData?.DOJ ?? "",
                UserID: employeeData?.UserID ?? "",
                Password: employeeData?.Password ?? "",
                EmplStatus: employeeData?.EmplStatus ?? "",
                Email: employeeData?.Email ?? "",
            });
        }
    }, [isEdit, employee]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const togglePasswordVisibility = (): void => {
        setShowPassword(prev => !prev);
    };

    console.log("formData: ", formData);


    // Submit Logo
    const handleSubmit = async (e: FormEvent): Promise<void> => {
        try {
            e.preventDefault();
            if (!formData.EmplName) {
                toast.error("Please Enter Employee Name");
                return;
            }
            if (!formData.EmplStatus) {
                toast.error("Please Give Employee Status");
                return;
            }
            if (!formData.EmplTag) {
                toast.error("Please Give Employee Tag");
                return;
            }
            if (!formData.EmplType) {
                toast.error("Please Give Employee Type");
                return;
            }
            if (!formData.DeptCode) {
                toast.error("Please Give Department");
                return;
            }
            if (!formData.DesgCode) {
                toast.error("Please Give Designation");
                return;
            }
            if (!formData.DOB) {
                toast.error("Please Give Date Of Birth");
                return;
            }
            if (!formData.DOJ) {
                toast.error("Please Give Date Of Joining");
                return;
            }
            if (!formData.UserID) {
                toast.error("Please Give User Id");
                return;
            }
            if (!formData.Password) {
                toast.error("Please Give Password");
                return;
            }
            if (!formData.Email) {
                toast.error("Please Give Email ID");
                return;
            }
            dispatch(addEmployee(formData));

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
                toast.error("Invalid Employee ID");
                return;
            }
            if (!formData.EmplName) {
                toast.error("Please Enter Employee Name");
                return;
            }
            if (!formData.EmplStatus) {
                toast.error("Please Give Employee Status");
                return;
            }
            if (!formData.EmplTag) {
                toast.error("Please Give Employee Tag");
                return;
            }
            if (!formData.EmplType) {
                toast.error("Please Give Employee Type");
                return;
            }
            if (!formData.DeptCode) {
                toast.error("Please Give Department");
                return;
            }
            if (!formData.DesgCode) {
                toast.error("Please Give Designation");
                return;
            }
            if (!formData.DOB) {
                toast.error("Please Give Date Of Birth");
                return;
            }
            if (!formData.DOJ) {
                toast.error("Please Give Date Of Joining");
                return;
            }
            if (!formData.UserID) {
                toast.error("Please Give User Id");
                return;
            }
            if (!formData.Password) {
                toast.error("Please Give Password");
                return;
            }
            if (!formData.Email) {
                toast.error("Please Give Email ID");
                return;
            }

            dispatch(updateEmployee({
                id,
                EmplName: formData.EmplName,
                EmplTag: formData.EmplTag,
                EmplType: formData.EmplType,
                DeptCode: formData.DeptCode,
                DesgCode: formData.DesgCode,
                DOB: formData.DOB,
                DOJ: formData.DOJ,
                UserID: formData.UserID,
                Password: formData.Password,
                EmplStatus: formData.EmplStatus,
                Email: formData.Email,
            }));
            setFormData(INITIAL_FORM_DATA);
            navigate("/employee/view");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!!!");
        }
    };

    return (
        <div className='d-flex justify-content-end'>
            {status === STATUES.LOADING && <Loader />}
            {departmentStatus === STATUES.LOADING && <Loader />}
            {designationStatus === STATUES.LOADING && <Loader />}
            {loading && <Loader />}
            <div className='form-header mx-2'>
                <section className="piechartsBox_area">
                    {!isEdit ? (
                        <div>
                            <h4 className='text-center' style={{ marginBottom: "20px" }}>
                                Add Employee
                            </h4>
                            <form onSubmit={handleSubmit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Employee Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Employee Name</label>
                                        <input
                                            type="text"
                                            id="EmplName"
                                            name="EmplName"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.EmplName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/*  Employee Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Employee Tag</label>
                                        <input
                                            type="text"
                                            id="EmplTag"
                                            name="EmplTag"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.EmplTag}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/*  Employee Type */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Employee Type</label>
                                        <select
                                            id="EmplType"
                                            name="EmplType"
                                            className="form-control"
                                            value={formData.EmplType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select employee types</option>
                                            {
                                                employeeTypes?.length > 0 ? employeeTypes?.map((item: ProjectHelpArrType) => (
                                                    <option key={item.code} value={item.code}>{item.data}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>

                                    {/*  Department Code */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Department</label>
                                        <select
                                            id="DeptCode"
                                            name="DeptCode"
                                            className="form-control"
                                            value={formData.DeptCode}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select department</option>
                                            {
                                                departments?.length > 0 ? departments?.map((item: DepartmentArrType) => (
                                                    <option key={item.DeptCode} value={item.DeptCode}>{item.DeptName}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>

                                    {/*  Designation Code */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Designation</label>
                                        <select
                                            id="DesgCode"
                                            name="DesgCode"
                                            className="form-control"
                                            value={formData.DesgCode}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select designation</option>
                                            {
                                                designations?.length > 0 ? designations?.map((item: DesignationArrType) => (
                                                    <option key={item.DesgCode} value={item.DesgCode}>{item.DesgName}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>

                                    {/*  DOB */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Date Of Birth</label>
                                        <input
                                            type="date"
                                            id="DOB"
                                            name="DOB"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.DOB}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/*  DOJ */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Date Of Joining</label>
                                        <input
                                            type="date"
                                            id="DOJ"
                                            name="DOJ"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.DOJ}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/*  User ID */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">User ID</label>
                                        <input
                                            type="text"
                                            id="UserID"
                                            name="UserID"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.UserID}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>


                                    {/*  User Email Id */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">User Email Id</label>
                                        <input
                                            type="email"
                                            id="Email"
                                            name="Email"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.Email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>


                                    {/*  User Password */}
                                    <div className="form-group mb-3 position-relative" style={{
                                        position: "relative"
                                    }}>
                                        <label htmlFor="category">User Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="Password"
                                            name="Password"
                                            className="form-control"
                                            value={formData.Password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span
                                            className="position-absolute end-0 top-50 mt-1 me-3"
                                            style={{ cursor: "pointer", transform: "translateY(50%)", position: "absolute", top: 20, right: 10 }}
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <i className="fas fa-eye-slash"></i>
                                            ) : (
                                                <i className="fas fa-eye"></i>
                                            )}
                                        </span>
                                    </div>

                                    {/*  Employee Status */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Employee Status</label>
                                        <select
                                            id="EmplStatus"
                                            name="EmplStatus"
                                            className="form-control"
                                            value={formData.EmplStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select employee status</option>
                                            {
                                                projectHelps?.length > 0 ? projectHelps?.map((item: ProjectHelpArrType) => (
                                                    <option key={item.code} value={item.code}>{item.data}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-5' style={{
                                    gap: 10,
                                }}>
                                    <button type='submit' className='btn btn-outline-primary w-25'>
                                        Add Employee
                                    </button>
                                    <button type='button' className='btn btn-outline-danger w-25' onClick={(() => navigate("/employee/view"))}>
                                        Search
                                    </button>
                                    <button type='button' className='btn btn-outline-secondary w-25' onClick={(() => setFormData(INITIAL_FORM_DATA))}>
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h4 className='text-center' style={{ marginBottom: "20px" }}>
                                Update Employee
                            </h4>
                            <form onSubmit={handleEdit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Employee Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Employee Name</label>
                                        <input
                                            type="text"
                                            id="EmplName"
                                            name="EmplName"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.EmplName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/*  Employee Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Employee Tag</label>
                                        <input
                                            type="text"
                                            id="EmplTag"
                                            name="EmplTag"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.EmplTag}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/*  Employee Type */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Employee Type</label>
                                        <select
                                            id="EmplType"
                                            name="EmplType"
                                            className="form-control"
                                            value={formData.EmplType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select employee types</option>
                                            {
                                                employeeTypes?.length > 0 ? employeeTypes?.map((item: ProjectHelpArrType) => (
                                                    <option key={item.code} value={item.code}>{item.data}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>

                                    {/*  Department Code */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Department</label>
                                        <select
                                            id="DeptCode"
                                            name="DeptCode"
                                            className="form-control"
                                            value={formData.DeptCode}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select department</option>
                                            {
                                                departments?.length > 0 ? departments?.map((item: DepartmentArrType) => (
                                                    <option key={item.DeptCode} value={item.DeptCode}>{item.DeptName}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>

                                    {/*  Designation Code */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Designation</label>
                                        <select
                                            id="DesgCode"
                                            name="DesgCode"
                                            className="form-control"
                                            value={formData.DesgCode}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select designation</option>
                                            {
                                                designations?.length > 0 ? designations?.map((item: DesignationArrType) => (
                                                    <option key={item.DesgCode} value={item.DesgCode}>{item.DesgName}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>

                                    {/*  DOB */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Date Of Birth</label>
                                        <input
                                            type="date"
                                            id="DOB"
                                            name="DOB"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.DOB}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/*  DOJ */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Date Of Joining</label>
                                        <input
                                            type="date"
                                            id="DOJ"
                                            name="DOJ"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.DOJ}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/*  User ID */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">User ID</label>
                                        <input
                                            type="text"
                                            id="UserID"
                                            name="UserID"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.UserID}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>


                                    {/*  User Email Id */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">User Email Id</label>
                                        <input
                                            type="email"
                                            id="Email"
                                            name="Email"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.Email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>


                                    {/*  User Password */}
                                    <div className="form-group mb-3 position-relative d-none" style={{
                                        position: "relative",
                                    }}>
                                        <label htmlFor="category">User Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="Password"
                                            name="Password"
                                            className="form-control"
                                            value={formData.Password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span
                                            className="position-absolute end-0 top-50 mt-1 me-3"
                                            style={{ cursor: "pointer", transform: "translateY(50%)", position: "absolute", top: 20, right: 10 }}
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <i className="fas fa-eye-slash"></i>
                                            ) : (
                                                <i className="fas fa-eye"></i>
                                            )}
                                        </span>
                                    </div>

                                    {/*  Employee Status */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Employee Status</label>
                                        <select
                                            id="EmplStatus"
                                            name="EmplStatus"
                                            className="form-control"
                                            value={formData.EmplStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select employee status</option>
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
                                        Update Employee
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

export default EmployeeForm;