import React, { useState, useEffect } from "react";
import { FloatingInput, FloatingPasswordInput } from '../components/FloatingInput';
import { login } from "../hooks/Auth";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toaster";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/", { replace: true });
        }
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password } = formData;

        if (!username || !password) {
            showToast("error", "Please enter both username and password.");
            return;
        }

        try {
            const res = await login({ username, password });
            showToast("success", res.data.message);

            const { token, user } = res.data;
            localStorage.setItem("authToken", token);
            localStorage.setItem("authUser", JSON.stringify(user));

            setFormData({
                username: "",
                password: "",
            });
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            showToast("error", err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-600 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FloatingInput
                        label="Username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />

                    <FloatingPasswordInput
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 mt-6"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-gray-600 text-center mt-2">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
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
