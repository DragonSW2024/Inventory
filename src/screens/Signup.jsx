import React, { useState } from "react";
import { FloatingInput, FloatingPasswordInput } from '../components/FloatingInput';
import Toast from "../components/Toaster";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../hooks/Auth";

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [adminPassword, setAdminPassword] = useState("");
    const [showAdminPrompt, setShowAdminPrompt] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            showToast("error", "Passwords do not match");
            return;
        }

        setShowAdminPrompt(true);
    };

    const handleAdminSubmit = async () => {
        if (adminPassword.trim() === "") {
            showToast("error", "Admin password is required");
            return;
        }

        try {
            const res = await signup({
                ...formData,
                adminPassword,
            });

            showToast("success", res.data.message);

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
            setAdminPassword("");
            setShowAdminPrompt(false);

            setTimeout(() => navigate("/login"), 1000); // redirect after toast
        } catch (err) {
            showToast("error", err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-600 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <FloatingInput
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <FloatingInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <FloatingPasswordInput
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <FloatingPasswordInput
                        label="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button
                        type="submit"
                        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-sm text-gray-600 text-center mt-2">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>

            {/* Admin Password Prompt Modal */}
            {showAdminPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-3">Admin Password Required</h3>
                        <FloatingPasswordInput
                            label="Admin Password"
                            name="adminPassword"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setShowAdminPrompt(false)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdminSubmit}
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
