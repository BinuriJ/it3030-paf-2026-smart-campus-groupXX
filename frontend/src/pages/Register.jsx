import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE_URL, storeAuth } from "../api/api";
import "../styles/dashboard.css";

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || "Registration failed. Please try again.";
}

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [age, setAge] = useState("");
  const [staffId, setStaffId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [orgName, setOrgName] = useState("");
  const [adminType, setAdminType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRoleValid = useMemo(() => {
    if (role === "STUDENT") {
      return department && studentId && academicYear && age;
    }

    if (role === "LECTURER") {
      return department && staffId && specialization;
    }

    if (role === "ADMIN") {
      return orgName && adminType;
    }

    return false;
  }, [
    academicYear,
    adminType,
    age,
    department,
    orgName,
    role,
    specialization,
    staffId,
    studentId,
  ]);

  const isFormValid = useMemo(() => {
    return (
      fullName.trim() &&
      email.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      address.trim() &&
      phone.trim() &&
      isRoleValid
    );
  }, [address, confirmPassword, email, fullName, isRoleValid, password, phone]);

  const generateStudentId = (dept) => {
    const num = Math.floor(100000 + Math.random() * 900000);
    if (dept === "Computing") return `IT${num}`;
    if (dept === "Engineering") return `EN${num}`;
    if (dept === "Business") return `BM${num}`;
    return "";
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    if (role === "STUDENT") {
      setStudentId(generateStudentId(value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid || loading) {
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
        address: address.trim(),
        phone: phone.trim(),
        department: department.trim(),
        studentId: studentId.trim(),
        academicYear: academicYear.trim(),
        age: age ? Number(age) : null,
        orgName: orgName.trim(),
        adminType: adminType.trim(),
        staffId: staffId.trim(),
        specialization: specialization.trim(),
      };

      const { data } = await api.post("/api/auth/register", payload);
      storeAuth(data);
      navigate(data.user.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Register Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            placeholder="Address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />

          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="STUDENT">Student</option>
            <option value="LECTURER">Lecturer</option>
            <option value="ADMIN">Admin</option>
          </select>

          {role === "STUDENT" ? (
            <div className="fade-section">
              <select value={department} onChange={(event) => handleDepartmentChange(event.target.value)}>
                <option value="">Select Department</option>
                <option value="Computing">Computing</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
              </select>

              <input value={studentId} readOnly placeholder="Student ID (Auto)" />
              <input
                placeholder="Academic Year"
                value={academicYear}
                onChange={(event) => setAcademicYear(event.target.value)}
              />
              <input
                type="number"
                min="1"
                placeholder="Age"
                value={age}
                onChange={(event) => setAge(event.target.value)}
              />
            </div>
          ) : null}

          {role === "LECTURER" ? (
            <div className="fade-section">
              <select value={department} onChange={(event) => setDepartment(event.target.value)}>
                <option value="">Select Department</option>
                <option value="Computing">Computing</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
              </select>

              <input
                placeholder="Staff ID"
                value={staffId}
                onChange={(event) => setStaffId(event.target.value)}
              />
              <input
                placeholder="Specialization"
                value={specialization}
                onChange={(event) => setSpecialization(event.target.value)}
              />
            </div>
          ) : null}

          {role === "ADMIN" ? (
            <div className="fade-section">
              <input
                placeholder="Organization Name"
                value={orgName}
                onChange={(event) => setOrgName(event.target.value)}
              />
              <input
                placeholder="Admin Type"
                value={adminType}
                onChange={(event) => setAdminType(event.target.value)}
              />
            </div>
          ) : null}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          {error ? <p className="error">{error}</p> : null}

          <button type="submit" disabled={!isFormValid || loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          className="google-btn"
          onClick={() => {
            window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
          }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
