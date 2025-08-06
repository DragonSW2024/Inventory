import React, { useState } from "react";

// Floating Input Field (e.g., username, email)
export function FloatingInput({ label, type, name, value, onChange }) {
    const [isFocused, setIsFocused] = useState(false);
    const hasText = value && value.length > 0;

    return (
        <div className="relative w-full mt-4">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="peer w-full border border-gray-300 rounded-md px-3 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder=" "
                required
            />
            <label
                htmlFor={name}
                className={`absolute left-3 top-2 text-gray-500 text-sm transition-all duration-200 ${isFocused || hasText ? "text-xs -top-1 bg-white px-1 text-indigo-600" : ""
                    }`}
            >
                {label}
            </label>
        </div>
    );
}

// Floating Password Input with Show/Hide Toggle
export function FloatingPasswordInput({ label, name, value, onChange }) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasText = value && value.length > 0;

    return (
        <div className="relative w-full mt-4">
            <input
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-md px-3 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                required
            />
            <label
                htmlFor={name}
                className={`absolute left-3 top-2 text-gray-500 text-sm transition-all duration-200 ${isFocused || hasText ? "text-xs -top-1 bg-white px-1 text-indigo-600" : ""
                    }`}
            >
                {label}
            </label>

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                tabIndex={-1}
            >
                <i className={`bx ${showPassword ? "bx-hide" : "bx-show"} text-xl`}></i>
            </button>
        </div>
    );
}
