import { Link } from "react-router-dom";
import "./SidebarLayout.css";
import { Outlet } from 'react-router-dom';

const SidebarLayout = ({ children }) => {
  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Admin</h2>

        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/cars">Cars</Link></li>
          <li><Link to="/drivers">Drivers</Link></li>
          <li><Link to="/fares">Fares</Link></li>
          <li><Link to="/markup">Markup</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/Bookings">Bookings</Link></li>
        </ul>
      </div>

     <div className="content">
       
        <Outlet /> 
      </div>
    </div>
  );
};

export default SidebarLayout;
