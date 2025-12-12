import React, { useEffect, useState } from "react";
import { getDrivers, deleteDriver, editDriver, addDriver } from "../../services/api"; 
import DriverForm from "./DriverForm";
import "./DriverList.css";

// Helper function to format the date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
};

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    // Load drivers at beginning
    useEffect(() => {
        fetchDrivers();
    }, []);

   const fetchDrivers = async () => {
    try {
        const data = await getDrivers();
        // This ensures 'isAvailable' exists on every driver object
        const driversWithStatus = data.map(driver => ({
            ...driver,
            isAvailable: driver.isActive !== undefined ? driver.isActive : false, // Default to false if not sent by API
        }));
        setDrivers(driversWithStatus);
    } catch (error) {
        console.error("Failed to fetch drivers:", error);
    }
};

    // Reset everything after Add / Edit
    const resetView = () => {
        setEditingDriver(null);
        setShowForm(false);
        fetchDrivers();
    };

    // Delete a driver
    const handleDelete = async (driverId) => {
        if (window.confirm("Are you sure you want to delete this driver?")) {
            try {
                await deleteDriver(driverId);
                fetchDrivers();
            } catch (error) {
                console.error("Failed to delete driver:", error);
                alert("Failed to delete driver.");
            }
        }
        setDropdownOpen(null); // close dropdown
    };


    // DriverList.js

const handleToggleStatus = async (driverId, currentStatus) => {
    const newStatus = !currentStatus;
    
    // 1. OPTIMISTIC UPDATE: Update the UI state IMMEDIATELY.
    setDrivers(prevDrivers => 
        prevDrivers.map(d => 
            // **CRITICAL:** Use the exact field name the component is reading (e.g., 'isAvailable')
            d.id === driverId ? { ...d, isAvailable: newStatus } : d 
        )
    );

    try {
        // 2. API CALL: Wait for the database update.
        // **CRITICAL:** Use the exact field name your backend is expecting (e.g., 'isActive')
        await editDriver(driverId, { isActive: newStatus }); 
        
        // 3. SYNCHRONIZATION: Re-fetch the data to ensure full synchronization 
        // with other potential changes on the server.
        fetchDrivers(); 

    } catch (error) {
        console.error("Failed to update driver status. Reverting local state:", error);
        alert("Failed to update status.");
        
        // 4. REVERT: If the API call fails, revert the local state back.
        setDrivers(prevDrivers => 
            prevDrivers.map(d => 
                d.id === driverId ? { ...d, isAvailable: currentStatus } : d 
            )
        );
    }
};
    const handleDropdown = (id) => {
        setDropdownOpen(dropdownOpen === id ? null : id);
    };

    return (
        <div className="driverlist-container"> 
            {/* TOP BUTTONS (Omitted for brevity, unchanged) */}
            <div className="driverlist-buttons">
                 <button
                    className={!showForm ? "driverlist-btn active" : "driverlist-btn"}
                    onClick={resetView}
                >
                    Driver List
                </button>

                <button
                    className={showForm && !editingDriver ? "driverlist-btn active" : "driverlist-btn"}
                    onClick={() => {
                        setEditingDriver(null); // empty form
                        setShowForm(true);
                    }}
                >
                    + Add Driver
                </button>
            </div>


            {/* FORM SECTION (Omitted for brevity, unchanged) */}
             {showForm && (
                <div className="driverlist-card"> 
                    <DriverForm 
                        initialData={editingDriver || {}}
                        onSubmit={
                            editingDriver
                                ? async (formData) => {
                                    await editDriver(editingDriver.id, formData);
                                    resetView();
                                }
                                : async (formData) => {
                                    await addDriver(formData);
                                    resetView();
                                }
                        }
                    />
                </div>
            )}

            {/* TABLE SECTION */}
            {!showForm && (
                <div className="driverlist-card">
                    <h2 className="driverlist-title">Driver Directory</h2> 

                    <table className="driverlist-table">
                        <thead>
                            <tr>
                                {/* Updated Headers */}
                                <th>Name</th>
                                <th>License No</th>
                                <th>Phone</th>
                                <th>Validity</th>
                                <th>Status</th> {/* This will hold the toggle */}
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {drivers.map((driver) => ( 
                                <tr
                                    key={driver.id}
                                    className={dropdownOpen === driver.id ? "action-col dropup-mode" : "action-col"}
                                >
                                    {/* 1. Name: Combine First and Last Name */}
                                    <td>{driver.firstName} {driver.lastName}</td>
                                    
                                    {/* 2. License No: Use 'licence' from API */}
                                    <td>{driver.licence}</td> 
                                    
                                    {/* 3. Phone: Use 'phone' (or N/A if missing in your actual driver object) */}
                                    <td>{driver.phone || 'N/A'}</td>
                                    
                                    {/* 4. Validity: Format the date string */}
                                    <td>{formatDate(driver.validity)}</td>

                                    {/* 5. Status: Implement the Toggle Button */}
                                    {/* NOTE: I am using 'isAvailable' as a hypothetical boolean status field. 
                                        You might need to adjust this to 'isActive' or 'isDuty' based on your API. */}
                                  <td className="status-col">
    <label className="toggle-switch">
        <input 
            type="checkbox" 
            checked={driver.isAvailable} // Assuming 'isAvailable' is the backend field
            onChange={() => handleToggleStatus(driver.id, driver.isAvailable)} 
        />
        <span className="slider round"></span>
    </label>
</td>

                                    {/* Action Column (Unchanged) */}
                                    <td className="action-col">
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDropdown(driver.id)}
                                        >
                                            Action
                                        </button>
                                        {dropdownOpen === driver.id && (
                                            <div className="action-menu">
                                                <p
                                                    onClick={() => {
                                                        setEditingDriver(driver); 
                                                        setShowForm(true);  
                                                        setDropdownOpen(null);
                                                    }}
                                                >
                                                    Edit
                                                </p>
                                                <p onClick={() => handleDelete(driver.id)}>Delete</p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DriverList;