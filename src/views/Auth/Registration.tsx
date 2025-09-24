import React, { useEffect, useState } from "react";
import "./Auth.css";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { RoleArrType } from "@/@types/role";
import { STATUES } from "@/utils/Status";
import Loader from "@/components/commons/Loader";
import { getAllRoles } from "@/redux/Roles/roleSlice";
import { signUpUser } from "@/redux/Authentication/authSlice";
import type { UserSignUpCredentialsType } from "@/@types/auth";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Registration: React.FC = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const [allRoles, setAllRoles] = useState<RoleArrType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { roles, status } = useAppSelector(state => state.role);
  const { status: statusReg, redirectReg } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllRoles());
  }, [dispatch]);

  useEffect(() => {
    if (roles?.length) {
      setAllRoles(roles);
    } else {
      setAllRoles([]);
    }
  }, [roles]);

  const [formData, setFormData] = useState<UserSignUpCredentialsType>({
    name: "",
    email: "",
    password: "",
    role: 0, // Changed to 0 to indicate no selection
  });

  useEffect(() => {
    if (redirectReg) {
      navigate(redirectReg);
    }
  }, [redirectReg, navigate]);

  // Validation function
  const validateField = (name: string, value: string | number): string => {
    switch (name) {
      case "name":
        if (!value) return "Full name is required";
        if (value.toString().trim().length < 2) return "Name must be at least 2 characters";
        if (value.toString().trim().length > 50) return "Name must be less than 50 characters";
        return "";

      case "email":
        {
          if (!value) return "Email is required";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.toString())) return "Please enter a valid email address";
          return "";
        }

      case "password":
        if (!value) return "Password is required";
        if (value.toString().length < 6) return "Password must be at least 6 characters";
        if (value.toString().length > 20) return "Password must be less than 20 characters";
        return "";

      case "role":
        if (!value || value === 0) return "Please select a role";
        return "";

      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof UserSignUpCredentialsType]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === "role" ? parseInt(value, 10) : value
    }));

    // Validate field on change if it's been touched
    if (touched[name]) {
      const error = validateField(name, name === "role" ? parseInt(value, 10) : value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, name === "role" ? parseInt(value, 10) : value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setTouched(allTouched);

    // Validate entire form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Ensure role is a number
    const submissionData = {
      ...formData,
      role: Number(formData.role)
    };

    // console.log("Submitting form:", submissionData);
    dispatch(signUpUser(submissionData));
  };

  // Check if form is valid for button styling
  const isFormValid = () => {
    return Object.values(errors).every(error => !error) &&
      Object.values(formData).every(value =>
        typeof value === "number" ? value !== 0 : value.trim() !== ""
      );
  };

  return (
    <div className="registration-container">
      {status === STATUES.LOADING && <Loader />}
      {statusReg === STATUES.LOADING && <Loader />}

      <div className="background-overlay"></div>

      <div className="registration-card">
        <div className="card-header">
          <h2 className="title">Employee Registration</h2>
          <p className="subtitle">Join our Employee Management System</p>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              required
              className={errors.name ? "" : ""}
            />
            <label htmlFor="name">Full Name</label>
            <div className={`input-underline ${errors.name ? "error" : ""}`}></div>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              required
              className={errors.email ? "" : ""}
            />
            <label htmlFor="email">Email Address</label>
            <div className={`input-underline ${errors.email ? "" : ""}`}></div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              required
              className={errors.password ? "error" : ""}
            />
            <label htmlFor="password">Password</label>
            <div className={`input-underline ${errors.password ? "" : ""}`}></div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="input-group">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.role ? "error" : ""}
            >
              <option value="0">Select a role</option>
              {allRoles?.length > 0 ? allRoles?.map(role => (
                <option key={role?.id} value={role?.id}>{role?.roleName}</option> // Use role.id for value
              )) : (<option value="0" disabled>Loading roles...</option>)}
            </select>
            <label htmlFor="role" className="select-label">Role</label>
            <div className={`input-underline ${errors.role ? "error" : ""}`}></div>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          <button
            type="submit"
            className={`btn-submit ${!isFormValid() ? "disabled" : ""}`}
            disabled={!isFormValid() || statusReg === STATUES.LOADING}
          >
            <span>
              {statusReg === STATUES.LOADING ? "Registering..." : "Register"}
            </span>
            <div className="fill-container"></div>
          </button>
        </form>

        {/* Rest of your component remains the same */}
        <div className="alternative-login">
          <div className="divider">
            <span>Or register with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn google">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            <button type="button" className="social-btn microsoft">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#f25022" d="M1 1h10v10H1z" />
                <path fill="#00a4ef" d="M13 1h10v10H13z" />
                <path fill="#7fba00" d="M1 13h10v10H1z" />
                <path fill="#ffb900" d="M13 13h10v10H13z" />
              </svg>
              Microsoft
            </button>
          </div>
        </div>

        <p className="footer-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;