import React, { useEffect, useState } from 'react'

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("authUser"));
    const [progress, setProgress] = useState(0);
    const [activeTab] = useState("This Month");
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress / 100);
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        return Array.from({ length: 6 }, () =>
            letters[Math.floor(Math.random() * 16)]
        ).join("");
    };

    const generateAvatarUrl = (name) => {
        const firstLetter = name?.charAt(0) || "?";
        const backgroundColor = getRandomColor();
        return `https://ui-avatars.com/api/?background=${backgroundColor}&size=130&color=FFF&font-size=0.60&name=${firstLetter}`;
    };

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => {
            setProgress(78); // Target percentage
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='p-1'>
            <div className='w-full h-32 bg-white rounded-sm p-6'>
                <div className='flex flex-row items-center shadow gap-3 p-4'>
                    <img
                        src={generateAvatarUrl(user?.username)}
                        alt="UserImage"
                        className="w-[50px] h-[50px] rounded-full"
                    />
                    <div>
                        <h1 className='text-lg'>Hello, <span className='text-maincolor'>{user?.username}</span></h1>
                        <p className='text-sm'>Demo user</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-6 p-6 bg-gray-50 ">
                {/* Sales Activity */}
                <div className="bg-white rounded-lg shadow p-6 w-2/3">
                    <h2 className="text-lg font-semibold mb-4">Product Activity</h2>
                    <div className="grid grid-cols-4 divide-x">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-blue-500">51</span>
                            <span className="text-sm text-gray-500">Qty</span>
                            <span className="text-xs text-gray-400 mt-1">ⓘ IN-USE</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-pink-500">40</span>
                            <span className="text-sm text-gray-500">Pkgs</span>
                            <span className="text-xs text-gray-400 mt-1">ⓘ IN-STOCK</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-green-500">52</span>
                            <span className="text-sm text-gray-500">Pkgs</span>
                            <span className="text-xs text-gray-400 mt-1">ⓘ TO BE ORDERED</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-yellow-500">97</span>
                            <span className="text-sm text-gray-500">Qty</span>
                            <span className="text-xs text-gray-400 mt-1">ⓘ TO BE INVOICED</span>
                        </div>
                    </div>
                </div>

                {/* Inventory Summary */}
                <div className="bg-white rounded-lg shadow p-6 w-1/3">
                    <h2 className="text-lg font-semibold mb-4">Inventory Summary</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-500">QUANTITY IN HAND</span>
                            <span className="text-sm font-semibold">12746</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-500">QUANTITY TO BE RECEIVED</span>
                            <span className="text-sm font-semibold">62</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-6 p-6 bg-gray-50">
                {/* Product Details */}
                <div className="bg-white rounded-lg shadow p-6 w-2/3 flex">
                    <div className="w-1/2 border-r pr-6">
                        <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-red-500 text-sm">Low Stock Items</span>
                                <span className="text-red-500 font-semibold text-sm">22</span>
                            </div>
                            {/* <div className="flex justify-between">
                                <span className="text-gray-700">All Item Groups</span>
                                <span className="font-semibold">34</span>
                            </div> */}
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm">All Items</span>
                                <span className="font-semibold text-sm">129</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col items-center justify-center">
                        <span className="text-gray-600 mb-2">Active Items</span>
                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="56"
                                    cy="56"
                                    r={radius}
                                    stroke="#e5e7eb"
                                    strokeWidth="10"
                                    fill="none"
                                />
                                <circle
                                    cx="56"
                                    cy="56"
                                    r={radius}
                                    stroke="#10b981"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
                                {progress}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border p-6 w-1/3">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Purchase Order</h2>
                        <select className="text-sm border rounded px-2 py-1 cursor-pointer">
                            <option>This Month</option>
                            <option>Last Month</option>
                        </select>
                    </div>

                    {/* Quantity Ordered */}
                    <div className="text-center mb-6">
                        <p className="text-gray-600 mb-1 text-sm">Quantity Ordered</p>
                        <p className="text-2xl font-bold text-blue-500">2.00</p>
                    </div>

                    <hr className="my-4" />

                    {/* Total Cost */}
                    <div className="text-center">
                        <p className="text-gray-600 mb-1 text-sm">Total Cost</p>
                        <p className="text-xl font-bold text-blue-500">Rs.14500.00</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard