import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

function AllItems() {
    const [items, setItems] = useState([]);
    const [view, setView] = useState('list');
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [newItem, setNewItem] = useState({
        name: '',
        model: '',
        count: '',
        category: '',
        price: '',
        condition: 'Good',
        createdBy: currentUser?.username || 'Unknown',
        modifiedBy: currentUser?.username || 'Unknown',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchItems = async () => {
        try {
            const res = await axios.get('http://192.168.10.102:8866/products');
            setItems(res.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleAddItem = async () => {
        if (!newItem.name || !newItem.price) return;
        try {
            const res = await axios.post('http://192.168.10.102:8866/products', newItem);
            setItems([...items, res.data]);
            setNewItem({
                name: '',
                model: '',
                count: '',
                category: '',
                price: '',
                condition: 'Good',
                createdBy: currentUser?.username || 'Unknown',
                modifiedBy: currentUser?.username || 'Unknown',
            });
            setShowModal(false);
        } catch (err) {
            console.error('Failed to add item:', err);
        }
    };

    const handleUpdateItem = async () => {
        if (!selectedItem || !selectedItem._id) {
            console.error("Invalid selected item for update:", selectedItem);
            return;
        }

        try {
            const res = await axios.put(
                `http://192.168.10.102:8866/products/${selectedItem._id}`,
                selectedItem
            );

            const updated = res.data;

            if (!updated || !updated._id) {
                console.error("Invalid response from server:", updated);
                return;
            }

            // Update item in the list
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === updated._id ? updated : item
                )
            );

            // Update selected item to reflect new state
            setSelectedItem({ ...updated, editing: false });
            setSelectedItem(null);

        } catch (err) {
            console.error("Failed to update item:", err);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`http://192.168.10.102:8866/products/${id}`);
            setItems(items.filter(item => item._id !== id));
            setSelectedItem(null);
        } catch (err) {
            console.error('Failed to delete item:', err);
        }
    };

    const handleMouseEnter = (e) => {
        const rect = e.target.getBoundingClientRect();
        setPosition({ x: rect.right, y: rect.top });
        setShowQR(true);
    };

    const handleMouseLeave = () => {
        setShowQR(false);
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
                                    <th className="p-3">#</th>
                                    <th className="p-3">Product ID</th>
                                    <th className="p-3">Product Name</th>
                                    <th className="p-3">Model</th>
                                    <th className="p-3">Count</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Price</th>
                                    <th className="p-3">Condition</th>
                                    <th className="p-3">Created By</th>
                                    <th className="p-3">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, idx) => {
                                    if (!item || typeof item !== 'object') return null;
                                    return (
                                        <>
                                            <tr key={item._id || idx} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedItem({ ...item, editing: false })}>
                                                <td className="p-3">{idx + 1 + ((currentPage - 1) * itemsPerPage)}</td>
                                                <td className="p-3">{item.id}</td>
                                                <td className="p-3 text-blue-600 hover:underline cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{item.name}</td>
                                                <td className="p-3">{item.model}</td>
                                                <td className="p-3">{item.count}</td>
                                                <td className="p-3">{item.category}</td>
                                                <td className="p-3 font-medium">Rs: {item.price}</td>
                                                <td className="p-3">{item.condition}</td>
                                                <td className="p-3">{item.createdBy}</td>
                                                <td className="p-3">{new Date(item.createdAt).toLocaleString('sv-SE', { hour12: false })}</td>
                                            </tr>
                                            {showQR && (
                                                    <div
                                                        className="absolute bg-white border rounded shadow-lg p-4 z-50"
                                                        style={{ top: position.y, left: position.x }}
                                                    >
                                                        <div className="text-center mb-2 font-semibold">{item.name}</div>
                                                        <QRCodeCanvas value={JSON.stringify(item)} size={128} />
                                                    </div>
                                                )
                                            }
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => changePage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}>{i + 1}</button>
                            ))}
                            <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </>
            )}

            {/* Grid View */}
            {view === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="border p-4 rounded shadow hover:shadow-md transition">
                            <h2 className="text-blue-600 font-semibold">{item.name}</h2>
                            <p className="text-sm"><strong>Model:</strong> {item.model}</p>
                            <p className="text-sm"><strong>Category:</strong> {item.category}</p>
                            <p className="text-sm"><strong>Price:</strong> {item.price}</p>
                            <p className="text-sm"><strong>Condition:</strong> {item.condition}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                        <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
                        <div className="space-y-3">
                            <input className="w-full border p-2 rounded" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                            <input className="w-full border p-2 rounded" placeholder="Model" value={newItem.model} onChange={(e) => setNewItem({ ...newItem, model: e.target.value })} />
                            <input className="w-full border p-2 rounded" placeholder="Count" value={newItem.count} onChange={(e) => setNewItem({ ...newItem, count: e.target.value })} />
                            <input className="w-full border p-2 rounded" placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
                            <input className="w-full border p-2 rounded" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
                            <select className="w-full border p-2 rounded" value={newItem.condition} onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}>
                                <option value="Good">Good</option>
                                <option value="Medium">Medium</option>
                                <option value="Bad">Bad</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={handleAddItem} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Side Panel */}
            <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 border-l transform transition-transform duration-300 ${selectedItem ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-semibold">Product Details</h2>

                    <div className="flex items-center gap-2">
                        {selectedItem?.editing ? (
                            <>
                                <button onClick={handleUpdateItem} title="Save">
                                    <i className="bx bx-save text-blue-600 text-xl hover:scale-110 transition" />
                                </button>
                                <button onClick={() => setSelectedItem({ ...selectedItem, editing: false })} title="Cancel">
                                    <i className="bx bx-x-circle text-gray-500 text-xl hover:scale-110 transition" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setSelectedItem({ ...selectedItem, editing: true })} title="Edit">
                                    <i className="bx bx-edit text-blue-600 text-xl hover:scale-110 transition" />
                                </button>
                                <button onClick={() => handleDeleteItem(selectedItem._id)} title="Delete">
                                    <i className="bx bx-trash text-gray-600 text-xl hover:scale-110 transition" />
                                </button>
                            </>
                        )}

                        {/* Close button */}
                        <button onClick={() => setSelectedItem(null)} title="Close">
                            <i className="bx bx-x text-gray-500 text-2xl hover:text-red-600 hover:scale-110 transition" />
                        </button>
                    </div>
                </div>
                {selectedItem && (
                    <>
                        <div className="p-4 space-y-3">
                            {selectedItem.editing ? (

                                <>
                                    <input className="w-full border p-2 rounded" value={selectedItem.name || ""} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} />
                                    <input className="w-full border p-2 rounded" value={selectedItem.model || ""} onChange={(e) => setSelectedItem({ ...selectedItem, model: e.target.value })} />
                                    <input className="w-full border p-2 rounded" value={selectedItem.count || ""} onChange={(e) => setSelectedItem({ ...selectedItem, count: e.target.value })} />
                                    <input className="w-full border p-2 rounded" value={selectedItem.category || ""} onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })} />
                                    <input className="w-full border p-2 rounded" value={selectedItem.price || ""} onChange={(e) => setSelectedItem({ ...selectedItem, price: e.target.value })} />
                                    <select className="w-full border p-2 rounded" value={selectedItem.condition || ""} onChange={(e) => setSelectedItem({ ...selectedItem, condition: e.target.value })}>
                                        <option value="Good">Good</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Bad">Bad</option>
                                    </select>
                                </>
                            ) : (
                                <>
                                    <div className="mt-4 text-center flex flex-col items-center w-full">
                                        <QRCodeCanvas value={JSON.stringify(selectedItem)} size={150} />
                                        <h3 className="font-semibold mb-2">{selectedItem.name}</h3>
                                    </div>
                                    <table className="w-full border border-gray-300">
                                        <tbody>
                                            <tr>
                                                <td className="p-2 font-semibold border border-gray-300">Product Name</td>
                                                <td className="p-2 border border-gray-300">{selectedItem.name}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold border border-gray-300">Model</td>
                                                <td className="p-2 border border-gray-300">{selectedItem.model}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold border border-gray-300">Count</td>
                                                <td className="p-2 border border-gray-300">{selectedItem.count}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold border border-gray-300">Category</td>
                                                <td className="p-2 border border-gray-300">{selectedItem.category}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold border border-gray-300">Price</td>
                                                <td className="p-2 border border-gray-300">{selectedItem.price}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 font-semibold border border-gray-300">Condition</td>
                                                <td className="p-2 border border-gray-300">{selectedItem.condition}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                        {/* <div className="p-4 border-t flex justify-between">
                            {selectedItem.editing ? (
                                <>
                                    <button onClick={handleUpdateItem} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                                    <button onClick={() => setSelectedItem({ ...selectedItem, editing: false })} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setSelectedItem({ ...selectedItem, editing: true })} className="px-4 py-2 bg-blue-600 text-white rounded">Edit</button>
                                    <button onClick={() => handleDeleteItem(selectedItem._id)} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                                </>
                            )}
                        </div> */}
                    </>
                )}
            </div>
        </div>
    );
}

export default AllItems;
