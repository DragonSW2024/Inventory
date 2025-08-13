import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mainlogo from '../assets/mainlogo.png';

function Sidebar({ collapsed }) {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = '/';
  const menuItems = [
    {
      name: "Dashboard",
      icon: "bx bxs-dashboard",
      url: `${basePath}`,
      roles: ["admin"]
    },
    {
      name: "Inventory",
      icon: "bx bx-basket",
      url: null,
      roles: ["admin"],
      submenu: [
        { name: "Product List", url: `${basePath}inventory/products` },
        { name: "Stock Report", url: `${basePath}/inventory/stock` },
      ]
    },
    // { name: "Sales", icon: "bx bx-cart", url: `${basePath}/sales`, roles: ["admin"] },
    { name: "Purchases", icon: "bx bx-shopping-bag", url: `${basePath}/purchases`, roles: ["admin"] },
    { name: "Vendor", icon: "bx bx-store", url: `${basePath}vendor`, roles: ["admin"] },
  ];
  const visibleMenu = menuItems.filter(item => item.roles.includes("admin"));

  return (
    <div
      className={`flex flex-col bg-white border-r transition-all duration-300 ${collapsed ? "p-2 w-[70px]" : "p-2 w-[200px]"
        } h-[100vh]`}
    >
      {!collapsed ? (
        <div className="w-[50px] h-[50px] flex flex-row items-center">
          <img src={mainlogo} alt="Vaanfly" className="w-full h-full" />
          <h1 className="font-medium text-lg text-gray-600 pointer-events-none">Inventory</h1>
        </div>
      ) : (
        <div className="w-[50px] h-[50px]">
          <img src={mainlogo} alt="Vaanfly" className="w-full h-full" />
        </div>
      )}
      <ul className="flex flex-col grow px-2 my-3">
        {visibleMenu.map((item, index) => {
          const isActive = location.pathname === item.url;
          const hasSubmenu = Array.isArray(item.submenu);
          const isOpen = openSubmenu === item.name;
          return (
            <li className="mb-2" key={index}>
              {item.url ? (
                <Link
                  to={item.url}
                  className={`flex items-center p-2 no-underline rounded-md transition-colors
                  ${isActive ? 'text-maincolor' : 'text-gray-800 hover:text-maincolor'}`}
                >
                  <i className={`${item.icon} text-xl me-2`}></i>
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() =>
                      setOpenSubmenu(isOpen ? null : item.name)
                    }
                    className={`flex items-center w-full p-2 text-left no-underline rounded-md transition-colors ${isOpen ? "text-maincolor" : "text-gray-800 hover:text-maincolor"
                      }`}
                  >
                    <i className={`${item.icon} text-xl me-2`}></i>
                    {!collapsed && (
                      <>
                        <span>{item.name}</span>
                        <i className={`bx bx-chevron-${isOpen ? "up" : "down"} ms-auto`}></i>
                      </>
                    )}
                  </button>

                  {/* Submenu */}
                  <div
                    className={`ms-8 overflow-hidden transition-all duration-100 ease-in-out ${isOpen && !collapsed ? "max-h-40 mt-1" : "max-h-0"
                      }`}
                  >
                    <ul>
                      {item.submenu.map((sub, subIndex) => {
                        const isSubActive = location.pathname === sub.url;
                        return (
                          <li key={subIndex}>
                            <Link
                              to={sub.url}
                              className={`block p-2 rounded-md text-sm transition-colors no-underline ${isSubActive ? "text-maincolor" : "text-gray-600 hover:text-maincolor"
                                }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {!collapsed && (
        <>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("authUser");
              navigate("/login");
            }}
            className="flex items-center px-4 py-2 mx-2 mb-3 text-gray text-sm transition hover:text-maincolor"
          >
            <i className="bx bx-log-out text-xl me-2"></i>
            Logout
          </button>
          <div className="text-xs text-gray-500 text-center px-2 py-3 pointer-events-none">
            <hr className="my-2" />
            VAANFLY © 2025 Inventory
          </div>
        </>
      )}
    </div>
  )
}

export default Sidebar