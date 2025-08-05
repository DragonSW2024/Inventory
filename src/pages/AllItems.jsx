import React, { useState } from 'react';
const initialItems = [
    {
        name: "Nut",
        id: "013",
        type: "Mechanical",
        description: "Hexagonal metal nut used with bolts for fastening.",
        rate: "Rs.3.00",
    },
    {
        name: "Bolt",
        id: "014",
        type: "Mechanical",
        description: "Stainless steel bolt used in machinery assembly.",
        rate: "Rs.5.00",
    },
    {
        name: "Washer",
        id: "015",
        type: "Mechanical",
        description: "Flat washer to distribute load and reduce wear.",
        rate: "Rs.2.00",
    },
    {
        name: "Bearing",
        id: "016",
        type: "Mechanical",
        description: "Ball bearing for reducing friction in rotating parts.",
        rate: "Rs.45.00",
    },
    {
        name: "Screw",
        id: "017",
        type: "Mechanical",
        description: "Threaded fastener for metal and wooden components.",
        rate: "Rs.1.00",
    },
    {
        name: "Pulley",
        id: "018",
        type: "Mechanical",
        description: "Rotating wheel used to change the direction of force.",
        rate: "Rs.120.00",
    }
];

function AllItems() {
    const [items, setItems] = useState(initialItems);
    const [view, setView] = useState('list'); // list or grid
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        id: '',
        type: '',
        description: '',
        rate: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleAddItem = () => {
        if (!newItem.name) return;
        setItems([...items, newItem]);
        setNewItem({ name: '', id: '', type: '', description: '', rate: '' });
        setShowModal(false);
    };
    return (
        <div className="p-6 bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">All Items</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        + New
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => setView('list')} className={`border px-2 py-1 rounded ${view === 'list' && 'bg-gray-200'}`}>
                            <i className="bx bx-list-ul text-lg"></i>
                        </button>
                        <button onClick={() => setView('grid')} className={`border px-2 py-1 rounded ${view === 'grid' && 'bg-gray-200'}`}>
                            <i className="bx bx-grid-alt text-lg"></i>
                        </button>
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
                                    <th className="p-3"><input type="checkbox" /></th>
                                    <th className="p-3">PRODUCT ID</th>
                                    <th className="p-3">PRODUCT NAME</th>
                                    <th className="p-3">TYPE</th>
                                    <th className="p-3">DESCRIPTION</th>
                                    <th className="p-3">RATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="p-3"><input type="checkbox" /></td>
                                        <td className="p-3">{item.id}</td>
                                        <td className="p-3 text-blue-600 hover:underline cursor-pointer flex items-center gap-2">
                                            {/* <img src="https://via.placeholder.com/32" alt="item" className="w-8 h-8 rounded" /> */}
                                            {item.name}
                                        </td>
                                        <td className="p-3">{item.type}</td>
                                        <td className="p-3 text-gray-500 truncate max-w-xs">{item.description}</td>
                                        <td className="p-3 font-medium">{item.rate}</td>
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
                        <div key={idx} className="border p-4 rounded shadow hover:shadow-md transition">
                            <div className="flex items-center gap-3 mb-2">
                                {/* <img src="https://via.placeholder.com/40" alt="item" className="w-10 h-10 rounded" /> */}
                                <div>
                                    <h2 className="text-blue-600 font-semibold">{item.name}</h2>
                                    <p className="text-sm text-gray-500">{item.type}</p>
                                </div>
                            </div>
                            <p className="text-sm mb-1"><strong>id:</strong> {item.id}</p>
                            <p className="text-sm mb-1"><strong>Description:</strong> {item.description}</p>
                            <p className="text-sm font-medium text-gray-700"><strong>Rate:</strong> {item.rate}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                        <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
                        <div className="space-y-3">
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Name"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="id"
                                value={newItem.id}
                                onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Type"
                                value={newItem.type}
                                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Description"
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Rate"
                                value={newItem.rate}
                                onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={handleAddItem} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllItems