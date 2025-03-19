import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClipboardList,
  faUsers,
  faChartBar,
  faCogs,
  faToolbox,
  faBook,
  faLayerGroup,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css"; // Ensure you have this CSS file

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div className={isCollapsed ? "sidebar collapsed" : "sidebar"}>
      {/* Toggle Button */}
      <div className="toggle-btn" onClick={toggleSidebar}>
        
        <FontAwesomeIcon icon={faBars} />
        
      </div>

      {/* Sidebar Items */}
      <ul>
        <li className="toggle-btn">
          <Link to="/dashboard">
            <FontAwesomeIcon icon={faClipboardList} />
            {!isCollapsed && <span>DashBoard</span>}
          </Link>
        </li>
        <li className="toggle-btn">
          <FontAwesomeIcon icon={faLayerGroup} />
          {!isCollapsed && <span>Templates</span>}
        </li>
        <li className="toggle-btn">
          <Link to="/knowledge">
            <FontAwesomeIcon icon={faBook} />
            {!isCollapsed && <span>Knowledgebase</span>}
          </Link>
        </li>
        <li className="toggle-btn">
          <FontAwesomeIcon icon={faThLarge} />
          {!isCollapsed && <span>Categories</span>}
        </li>
        <li className="toggle-btn">
          <FontAwesomeIcon icon={faUsers} />
          {!isCollapsed && <span>Users</span>}
        </li>
        <li className="toggle-btn">
          <FontAwesomeIcon icon={faChartBar} />
          {!isCollapsed && <span>Reports</span>}
        </li>
        <li className="toggle-btn">
          <FontAwesomeIcon icon={faToolbox} />
          {!isCollapsed && <span>Tools</span>}
        </li>
        <li className="toggle-btn">
          <FontAwesomeIcon icon={faCogs} />
          {!isCollapsed && <span>Settings</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
