import React, { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";
import "./Layout.css"; // Import CSS for layout

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

      {/* Main content wrapper */}
      <div className={isCollapsed ? "main-content collapsed" : "main-content"}>
        <Navbar />
        <Outlet /> {/* This will render the current route */}
      </div>
    </div>
  );
};

export default Layout;
