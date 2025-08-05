import React from 'react'

function Header({ collapsed, toggleSidebar }) {
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

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-white flex justify-between items-center px-2 shadow-sm">
      <button
        onClick={toggleSidebar}
        className={`text-2xl bg-white text-black transition-all duration-300 w-[10px] ${collapsed ? "ml-[70px]" : "ml-[200px]"
          }`}
      >
        <i className="bx bx-menu text-black"></i>
      </button>

      <div className="flex flex-row-reverse gap-2 items-center">
        {/* <div>
          <p className="m-0 p-0">{"Demo User"}</p>
          <p className="m-0 p-0 text-sm">
            Vendor manager
          </p>
        </div> */}
        <img
          src={generateAvatarUrl("Demo")}
          alt="UserImage"
          className="w-[40px] h-[40px] rounded-full"
        />
      </div>
    </header>
  )
}

export default Header