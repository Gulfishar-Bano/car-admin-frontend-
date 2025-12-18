import React, { useState, useEffect, useCallback } from 'react';

import { 
    getFares, 
    addFare, 
    deleteFare, 
    findByLocation, 
    updateFare
} from '../../services/api'; 
import FareForm from './FareForm'; 
import './FareList.css'; 

const FareList = () => {
    const [fares, setFares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingFare, setEditingFare] = useState(null); 
    const [searchLocation, setSearchLocation] = useState({ from: '', to: '' });
     const [dropdownOpen, setDropdownOpen] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const fetchFares = useCallback(async (searchQuery = null) => {
        setLoading(true);
        try {
            let fetchedFares;
            if (searchQuery && searchQuery.from && searchQuery.to) {
     
                fetchedFares = await findByLocation(searchQuery.from, searchQuery.to);
            } else {
                fetchedFares = await getFares();
            }
            setFares(fetchedFares);
        } catch (error) {
            console.error("Error fetching fares:", error);
         
            if (error.message.includes("not found") || error.message.includes("400")) {
                setFares([]);
            } else {
                alert(`Failed to load fares: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }, []);

     const handleDropdown = (id) => {
        setDropdownOpen(dropdownOpen === id ? null : id);
    };


    useEffect(() => {
        fetchFares();
    }, [fetchFares]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchLocation(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchFares(searchLocation);
    };

    const handleClearSearch = () => {
        setSearchLocation({ from: '', to: '' });
        fetchFares(); 
    };
  const handleDelete = async (driverId) => {
        if (window.confirm("Are you sure you want to delete this fare?")) {
            try {
                await deleteFare(driverId);
                fetchFares();
            } catch (error) {
                console.error("Failed to delete fare:", error);
                alert("Failed to delete fare.");
            }
        }
        setDropdownOpen(null); 
    };

    
  
    const handleFormSubmit = async (fareData) => {
        try {
            if (editingFare) {
                
                await updateFare(editingFare.id, fareData); 
                alert(`Fare ID ${editingFare.id} updated successfully.`);
            } else {
                
                await addFare(fareData); 
                alert("New fare added successfully.");
            }
            
            
            setEditingFare(null); 
            setIsFormVisible(false);
            fetchFares(); 
        } catch (error) {
            console.error("Error submitting fare:", error);
            alert(`Submission Failed: ${error.message}`);
        }
    };

    
    const renderTable = () => {
        if (loading) return <p>Loading fares and applying markup...</p>;
        if (fares.length === 0) return <p>No fares found. {searchLocation.from ? 'Try clearing the search.' : ''}</p>;

        const firstFare = fares[0];
    
        const markupType = firstFare?.markupType || 'Unknown';

        return (
            <table className="fare-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Car</th>
                        <th>Route</th>
                        <th>Base Fare</th>
                        <th>Markup ({markupType})</th>
                        <th className="highlight">Final Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    {fares.map((fare) => (
        <tr key={fare.id}>
            <td>{fare.id}</td>
            <td>{fare.car?.model || 'N/A'}</td>
            <td>{fare.FromLocation} &rarr; {fare.ToLocation}</td>
            
           
            <td>₹{Number(fare.fare).toFixed(2)}</td> 
            
          
            <td>₹{Number(fare.markupValue).toFixed(2)}</td> 
            
            <td className="final-fare">₹{Number(fare.finalFare).toFixed(2)}</td>
           
              
 <td className="action-col">
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDropdown(fare.id)}
                                        >
                                            Action
                                        </button>
                                        {dropdownOpen === fare.id && (
                                            <div className="action-menu">
                                                <p
                                                    onClick={() => {
                                                        setEditingFare(fare); 
                                                        setShowForm(true);  
                                                        setDropdownOpen(null);
                                                    }}
                                                >
                                                    Edit
                                                </p>
                                                <p onClick={() => handleDelete(fare.id)}>Delete</p>
                                            </div>
                                        )}
                                    </td>
              
            
        </tr>
    ))}
</tbody>
            </table>
        );
    };

    // --- Component JSX ---
    return (
        <div className="fare-management-container">
            <h2>💰 Dynamic Fare Management</h2>

            <form className="search-bar" onSubmit={handleSearchSubmit}>
                {/* ... (Search inputs and buttons) ... */}
                <input
                    type="text" name="from" placeholder="From Location"
                    value={searchLocation.from} onChange={handleSearchChange}
                />
                <input
                    type="text" name="to" placeholder="To Location"
                    value={searchLocation.to} onChange={handleSearchChange}
                />
                <button type="submit">Search Route</button>
                <button type="button" onClick={handleClearSearch}>Clear</button>
            </form>
            <hr/>

            <button onClick={() => { setEditingFare(null); setIsFormVisible(true); }}>
                + Add New Fare
            </button>

           
            {isFormVisible && (
                <div className="fare-form-modal">
                    <FareForm 
                        initialData={editingFare} 
                        onSubmit={handleFormSubmit} 
                        onCancel={() => { setEditingFare(null); setIsFormVisible(false); }} 
                    />
                </div>
            )}
            
            {renderTable()}

        </div>
    );
};

export default FareList;