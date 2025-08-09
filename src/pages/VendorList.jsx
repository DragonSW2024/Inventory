import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import { generateEncryptedQRData } from '../components/CryptoJS';

function VendorList() {
    const [items, setItems] = useState([]);
    const [view, setView] = useState('list');
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [showQRtitle, setShowQRtitle] = useState('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [newVendor, setNewVendor] = useState({
        vendor_id: '',
        vendor_name: '',
        category: '',
        subcategory: '',
        address: '',
        contact_number: '',
        rating: '',
        lead_time_tracking: []
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);
    const sidebarRef = useRef(null);
    const [filterCategory, setFilterCategory] = useState("All");
    const [minRating, setMinRating] = useState(0);
    const API_BASE = "http://192.168.10.102:8866/api/vendors";

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setCurrentPage(1); // Reset to first page
        }
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = filterCategory === "All" || item.category === filterCategory;
        const matchesRating = item.rating >= minRating;
        const matchesSearch =
            searchQuery.trim() === "" ||
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            );
        return matchesCategory && matchesRating && matchesSearch;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await axios.get(API_BASE);
            setItems(res.data);
        } catch (err) {
            console.error("Error fetching vendors:", err);
        }
    };

    const handleAddVendor = async () => {
        if (!newVendor.vendor_name) return;
        try {
            await axios.post(API_BASE, newVendor);
            await fetchVendors();
            setNewVendor({
                vendor_id: '',
                vendor_name: '',
                category: '',
                subcategory: '',
                address: '',
                contact_number: '',
                rating: '',
                lead_time_tracking: []
            });
            setShowModal(false);
        } catch (err) {
            console.error("Error adding vendor:", err);
        }
    };

    const handleUpdateVendor = async () => {
        if (!selectedVendor) return;
        try {
            await axios.put(`${API_BASE}/${selectedVendor._id}`, selectedVendor);
            await fetchVendors();
            setSelectedVendor({ ...selectedVendor, editing: false });
        } catch (err) {
            console.error("Error updating vendor:", err);
        }
    };

    const handleDeleteVendor = async (vendor) => {
        if (!window.confirm(`Are you sure you want to delete ${vendor.vendor_name}?`)) return;
        try {
            await axios.delete(`${API_BASE}/${vendor._id}`);
            await fetchVendors();
            setSelectedVendor(null);
        } catch (err) {
            console.error("Error deleting vendor:", err);
        }
    };

    const handleMouseEnter = (e, vendor) => {
        const rect = e.target.getBoundingClientRect();
        setPosition({ x: rect.right, y: rect.top });
        setShowQR(true);
        setShowQRtitle(vendor.vendor_name);
    };

    const handleMouseLeave = () => {
        setShowQR(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSelectedVendor(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="p-6 bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Vendor List</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="border px-3 py-2 rounded w-64 text-sm"
                        title="Press Enter to search"
                    />
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                        + Add Vendor
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => setView('list')} className={`border px-2 py-1 rounded ${view === 'list' && 'bg-gray-200'}`}>
                            <i className="bx bx-list-ul text-lg"></i>
                        </button>
                        <button onClick={() => setView('grid')} className={`border px-2 py-1 rounded ${view === 'grid' && 'bg-gray-200'}`}>
                            <i className="bx bx-grid-alt text-lg"></i>
                        </button>
                    </div>
                    {/* Filter Icon */}
                    <div className="flex justify-end relative" ref={filterRef}>
                        <button
                            onClick={() => setShowFilters((prev) => !prev)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                            title="Filter Vendors"
                        >
                            <i className="bx bx-filter text-xl"></i>
                        </button>

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="absolute right-0 mt-12 bg-white border rounded shadow-lg p-4 w-72 z-10">
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => {
                                            setFilterCategory(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="All">All</option>
                                        <option value="Machining">Machining</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Consumables">Consumables</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={minRating}
                                        onChange={(e) => {
                                            setMinRating(parseFloat(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* List View */}
            {view === 'list' && (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b bg-gray-50 text-left text-gray-600">
                                    <th className="p-3">#</th>
                                    <th className="p-3">VENDOR ID</th>
                                    <th className="p-3">VENDOR NAME</th>
                                    <th className="p-3">CATEGORY</th>
                                    <th className="p-3">SUB CATEGORY</th>
                                    <th className="p-3">ADDRESS</th>
                                    <th className="p-3">CONTACT</th>
                                    <th className="p-3">RATING</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedVendor({ ...item, editing: false })}
                                    >
                                        <td className="p-3">{idx + 1 + ((currentPage - 1) * itemsPerPage)}</td>
                                        <td className="p-3">{item.vendor_id}</td>
                                        <td
                                            className="p-3 text-blue-600 hover:underline"
                                            onMouseEnter={(e) => handleMouseEnter(e, item)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            {item.vendor_name}
                                        </td>
                                        <td className="p-3">{item.category}</td>
                                        <td className="p-3">{item.subcategory}</td>
                                        <td className="p-3">{item.address}</td>
                                        <td className="p-3">{item.contact_number}</td>
                                        <td className="p-3">{item.rating}</td>
                                        {/* QR Code Popup */}
                                        {showQR && (
                                            <div
                                                className="absolute bg-white border rounded shadow-lg p-4 z-50"
                                                style={{ top: position.y, left: position.x }}
                                            >
                                                <div className="text-center mb-2 font-semibold">
                                                    {showQRtitle.length > 10
                                                        ? showQRtitle.slice(0, 10) + '...'
                                                        : showQRtitle}
                                                </div>
                                                <QRCodeCanvas value={generateEncryptedQRData(item)} size={128} />
                                            </div>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => changePage(i + 1)}
                                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Grid View */}
            {view === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="border p-4 rounded shadow hover:shadow-md transition cursor-pointer"
                            onClick={() => setSelectedVendor({ ...item, editing: false })}
                        >
                            <h2 className="text-blue-600 font-semibold">{item.vendor_name}</h2>
                            <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                            <p className="text-sm text-gray-500 mb-1">{item.subcategory}</p>
                            <p className="text-sm mb-1"><strong>ID:</strong> {item.vendor_id}</p>
                            <p className="text-sm mb-1"><strong>Contact:</strong> {item.contact_number}</p>
                            <p className="text-sm mb-1"><strong>Rating:</strong> {item.rating}</p>
                            <p className="text-sm text-gray-600"><strong>Address:</strong> {item.address}</p>
                        </div>
                    ))}
                </div>
            )}


            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                        <h2 className="text-lg font-semibold mb-4">Add New Vendor</h2>
                        <div className="space-y-3">
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Vendor ID"
                                value={newVendor.vendor_id}
                                onChange={(e) => setNewVendor({ ...newVendor, vendor_id: e.target.value })}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Vendor Name"
                                value={newVendor.vendor_name}
                                onChange={(e) => setNewVendor({ ...newVendor, vendor_name: e.target.value })}
                            />
                            <select
                                className="w-full border p-2 rounded"
                                value={newVendor.category}
                                onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                <option value="Mechanical">Mechanical</option>
                                <option value="Electronics">Electronics</option>
                                <option value="IT_Tools">IT_Tools</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Certification">Certification</option>
                            </select>
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Category"
                                value={newVendor.subcategory}
                                onChange={(e) => setNewVendor({ ...newVendor, subcategory: e.target.value })}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Address"
                                value={newVendor.address}
                                onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Contact Number"
                                value={newVendor.contact_number}
                                onChange={(e) => setNewVendor({ ...newVendor, contact_number: e.target.value })}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Rating"
                                type="number"
                                step="0.1"
                                value={newVendor.rating}
                                onChange={(e) => setNewVendor({ ...newVendor, rating: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={handleAddVendor} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Side Panel */}
            <div ref={sidebarRef} className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 border-l transform transition-transform duration-300 ${selectedVendor ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-semibold">Vendor Details</h2>

                    <div className="flex items-center gap-2">
                        {selectedVendor?.editing ? (
                            <>
                                <button onClick={handleUpdateVendor} title="Save">
                                    <i className="bx bx-save text-blue-600 text-xl hover:scale-110 transition" />
                                </button>
                                <button onClick={() => setSelectedVendor({ ...selectedVendor, editing: false })} title="Cancel">
                                    <i className="bx bx-x-circle text-gray-500 text-xl hover:scale-110 transition" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setSelectedVendor({ ...selectedVendor, editing: true })} title="Edit">
                                    <i className="bx bx-edit text-blue-600 text-xl hover:scale-110 transition" />
                                </button>
                                <button onClick={() => handleDeleteVendor(selectedVendor)} title="Delete">
                                    <i className="bx bx-trash text-gray-600 text-xl hover:scale-110 transition" />
                                </button>
                            </>
                        )}

                        {/* Close button */}
                        <button onClick={() => setSelectedVendor(null)} title="Close">
                            <i className="bx bx-x text-gray-500 text-2xl hover:text-red-600 hover:scale-110 transition" />
                        </button>
                    </div>
                </div>
                {selectedVendor && (
                    <>
                        <div className="p-4 overflow-y-auto h-[calc(100vh-60px)] space-y-3">
                            {selectedVendor.editing ? (
                                <>
                                    {/* Editable vendor fields */}
                                    <input className="w-full border p-2 rounded" value={selectedVendor.vendor_id || ""} onChange={(e) => setSelectedVendor({ ...selectedVendor, vendor_id: e.target.value })} />
                                    <input className="w-full border p-2 rounded" value={selectedVendor.vendor_name || ""} onChange={(e) => setSelectedVendor({ ...selectedVendor, vendor_name: e.target.value })} />
                                    <select
                                        className="w-full border p-2 rounded"
                                        value={selectedVendor.category || ""}
                                        onChange={(e) => setSelectedVendor({ ...selectedVendor, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="IT_Tools">IT_Tools</option>
                                        <option value="Hardware">Hardware</option>
                                        <option value="Certification">Certification</option>
                                    </select>
                                    <input className="w-full border p-2 rounded" value={selectedVendor.subcategory || ""} onChange={(e) => setSelectedVendor({ ...selectedVendor, subcategory: e.target.value })} />
                                    <input className="w-full border p-2 rounded" value={selectedVendor.address || ""} onChange={(e) => setSelectedVendor({ ...selectedVendor, address: e.target.value })} />
                                    <input className="w-full border p-2 rounded" value={selectedVendor.contact_number || ""} onChange={(e) => setSelectedVendor({ ...selectedVendor, contact_number: e.target.value })} />
                                    <input
                                        className="w-full border p-2 rounded"
                                        type="number"
                                        step="0.1"
                                        value={selectedVendor.rating || ""}
                                        onChange={(e) => setSelectedVendor({ ...selectedVendor, rating: parseFloat(e.target.value) })}
                                    />

                                    {/* Editable Lead Time Tracking */}
                                    <h3 className="font-semibold mt-4 mb-2 text-sm">Lead Time Tracking</h3>
                                    <div className="space-y-2">
                                        {selectedVendor.lead_time_tracking.map((order, idx) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <input
                                                    className="border p-1 rounded text-xs flex-1"
                                                    placeholder="Order ID"
                                                    value={order.order_id || ""}
                                                    onChange={(e) => {
                                                        const updated = [...selectedVendor.lead_time_tracking];
                                                        updated[idx].order_id = e.target.value;
                                                        setSelectedVendor({ ...selectedVendor, lead_time_tracking: updated });
                                                    }}
                                                />
                                                <input
                                                    type="date"
                                                    className="border p-1 rounded text-xs"
                                                    value={order.order_date || ""}
                                                    onChange={(e) => {
                                                        const updated = [...selectedVendor.lead_time_tracking];
                                                        updated[idx].order_date = e.target.value;
                                                        setSelectedVendor({ ...selectedVendor, lead_time_tracking: updated });
                                                    }}
                                                />
                                                <input
                                                    type="date"
                                                    className="border p-1 rounded text-xs"
                                                    value={order.expected_delivery || ""}
                                                    onChange={(e) => {
                                                        const updated = [...selectedVendor.lead_time_tracking];
                                                        updated[idx].expected_delivery = e.target.value;
                                                        setSelectedVendor({ ...selectedVendor, lead_time_tracking: updated });
                                                    }}
                                                />
                                                <input
                                                    type="date"
                                                    className="border p-1 rounded text-xs"
                                                    value={order.actual_delivery || ""}
                                                    onChange={(e) => {
                                                        const updated = [...selectedVendor.lead_time_tracking];
                                                        updated[idx].actual_delivery = e.target.value;
                                                        setSelectedVendor({ ...selectedVendor, lead_time_tracking: updated });
                                                    }}
                                                />
                                                <select
                                                    className="border p-1 rounded text-xs"
                                                    value={order.status || ""}
                                                    onChange={(e) => {
                                                        const updated = [...selectedVendor.lead_time_tracking];
                                                        updated[idx].status = e.target.value;
                                                        setSelectedVendor({ ...selectedVendor, lead_time_tracking: updated });
                                                    }}
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="On Time">On Time</option>
                                                    <option value="Late">Late</option>
                                                </select>
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                                    onClick={() => {
                                                        const updated = selectedVendor.lead_time_tracking.filter((_, i) => i !== idx);
                                                        setSelectedVendor({ ...selectedVendor, lead_time_tracking: updated });
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-xs"
                                        onClick={() => {
                                            setSelectedVendor({
                                                ...selectedVendor,
                                                lead_time_tracking: [
                                                    ...selectedVendor.lead_time_tracking,
                                                    {
                                                        order_id: "",
                                                        order_date: "",
                                                        expected_delivery: "",
                                                        actual_delivery: "",
                                                        status: ""
                                                    }
                                                ]
                                            });
                                        }}
                                    >
                                        + Add Lead Time Entry
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* View Mode */}
                                    <div className="mt-4 text-center flex flex-col items-center w-full">
                                        <QRCodeCanvas value={generateEncryptedQRData(selectedVendor)} size={150} />
                                        <h3 className="font-semibold mb-2">{selectedVendor.vendor_name}</h3>
                                    </div>
                                    <table className="w-full border border-gray-300">
                                        <tbody>
                                            <tr>
                                                <td className="p-2 font-semibold text-xs border border-gray-300">Vendor ID</td>
                                                <td className="p-2 border text-xs border-gray-300">{selectedVendor.vendor_id}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold text-xs border border-gray-300">Vendor Name</td>
                                                <td className="p-2 border text-xs border-gray-300">{selectedVendor.vendor_name}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold text-xs border border-gray-300">Category</td>
                                                <td className="p-2 border text-xs border-gray-300">{selectedVendor.category}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold text-xs border border-gray-300">Sub Category</td>
                                                <td className="p-2 border text-xs border-gray-300">{selectedVendor.subcategory}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold text-xs border border-gray-300">Address</td>
                                                <td className="p-2 border text-xs border-gray-300">{selectedVendor.address}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold text-xs border border-gray-300">Contact</td>
                                                <td className="p-2 border text-xs border-gray-300">{selectedVendor.contact_number}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold text-xs border border-gray-300">Rating</td>
                                                <td className="p-2 border text-xs border-gray-300">{selectedVendor.rating}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="mt-4">
                                        <h3 className="font-semibold mb-2 text-sm">Lead Time Tracking</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead>
                                                    <tr className="border-b bg-gray-50 text-left text-gray-600">
                                                        <th className="p-2 text-xs">Order ID</th>
                                                        <th className="p-2 text-xs">Order Date</th>
                                                        <th className="p-2 text-xs">Expected</th>
                                                        <th className="p-2 text-xs">Actual</th>
                                                        <th className="p-2 text-xs">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedVendor.lead_time_tracking && selectedVendor.lead_time_tracking.length > 0 ? (
                                                        selectedVendor.lead_time_tracking.map((order, idx) => (
                                                            <tr key={idx} className="border-b hover:bg-gray-50">
                                                                <td className="p-2 text-xs">{order.order_id}</td>
                                                                <td className="p-2 text-xs">{order.order_date}</td>
                                                                <td className="p-2 text-xs">{order.expected_delivery}</td>
                                                                <td className="p-2 text-xs">{order.actual_delivery}</td>
                                                                <td
                                                                    className={`p-2 text-xs ${order.status === 'On Time' ? 'text-green-600' : 'text-red-600'
                                                                        }`}
                                                                >
                                                                    {order.status}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="p-2 text-center text-xs text-gray-500">
                                                                No lead time tracking data
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default VendorList;