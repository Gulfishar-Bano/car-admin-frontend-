import React, { useEffect, useState } from "react";
import { getDrivers, deleteDriver, editDriver, addDriver } from "../../services/api"; 
import DriverForm from "./DriverForm";
import "./DriverList.css";

import { useDriverStatus } from '../Drivers/DriverStatusContext';


const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
};

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    
   
    const { updateDriverStats } = useDriverStatus();
 
    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const data = await getDrivers();
        
            const driversWithStatus = data.map(driver => ({
                ...driver,
         
                isAvailable: driver.isActive !== undefined ? driver.isActive : false, 
            }));
            setDrivers(driversWithStatus);

     
            const activeCount = driversWithStatus.filter(d => d.isAvailable).length;
            const totalCount = driversWithStatus.length;
            const inactiveCount = totalCount - activeCount;

            updateDriverStats({
                totalDrivers: totalCount,
                activeDrivers: activeCount,
                inactiveDrivers: inactiveCount,
            });
            
        } catch (error) {
            console.error("Failed to fetch drivers:", error);
        }
    };

    const resetView = () => {
        setEditingDriver(null);
        setShowForm(false);
        fetchDrivers(); 
    };

    
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
        setDropdownOpen(null); 
    };



    const handleToggleStatus = async (driverId, currentStatus) => {
        const newStatus = !currentStatus;
     
        setDrivers(prevDrivers => 
            prevDrivers.map(d => 
                d.id === driverId ? { ...d, isAvailable: newStatus } : d 
            )
        );

        try {
            
            await editDriver(driverId, { isActive: newStatus }); 
            
           
            fetchDrivers(); 

        } catch (error) {
            console.error("Failed to update driver status. Reverting local state:", error);
            alert("Failed to update status.");
            
          
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

            {!showForm && (
                <div className="driverlist-card">
                    <h2 className="driverlist-title">Driver Directory</h2> 

                    <table className="driverlist-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>License No</th>
                                <th>Phone</th>
                                <th>Validity</th>
                                <th>Status</th> 
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {drivers.map((driver) => ( 
                                <tr
                                    key={driver.id}
                                    className={dropdownOpen === driver.id ? "action-col dropup-mode" : "action-col"}
                                >
                                    <td>{driver.firstName} {driver.lastName}</td>
                                    <td>{driver.licence}</td> 
                                    <td>{driver.phone || 'N/A'}</td>
                                    <td>{formatDate(driver.validity)}</td>

                                    {/* 5. Status: Toggle Button Implementation */}
                                    <td className="status-col">
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={driver.isAvailable} 
                                                onChange={() => handleToggleStatus(driver.id, driver.isAvailable)} 
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>

                                    {/* Action Column */}
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