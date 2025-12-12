import React, { useState, useEffect, useCallback } from 'react';
// Import the new functions from api.js
import { 
    getFares, 
    addFare, 
    deleteFare, 
    findByLocation, // Corrected import for route search
    updateFare // New function for editing
} from '../../services/api'; 
import FareForm from './FareForm'; 
import './FareList.css'; // Assuming you have a CSS file for styling

const FareList = () => {
    const [fares, setFares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    // NEW: State to hold the data of the fare being edited
    const [editingFare, setEditingFare] = useState(null); 
    const [searchLocation, setSearchLocation] = useState({ from: '', to: '' });
     const [dropdownOpen, setDropdownOpen] = useState(null);
    const [showForm, setShowForm] = useState(false);
    // --- Data Fetching Function ---
    // Renamed findFaresByLocation to findByLocation to match your latest api.js
    const fetchFares = useCallback(async (searchQuery = null) => {
        setLoading(true);
        try {
            let fetchedFares;
            if (searchQuery && searchQuery.from && searchQuery.to) {
                // Use the location search function
                fetchedFares = await findByLocation(searchQuery.from, searchQuery.to);
            } else {
                fetchedFares = await getFares();
            }
            setFares(fetchedFares);
        } catch (error) {
            console.error("Error fetching fares:", error);
            // Handle 400 'not found' errors gracefully by setting fares to empty array
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

    // --- Search Handlers (Unchanged) ---
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
        setDropdownOpen(null); // close dropdown
    };

    
    // ------------------------------------

    // --- NEW: Edit Handlers ---
    const handleEditClick = (fare) => {
        setEditingFare(fare); // Set the fare data for the form
        setIsFormVisible(true); // Show the form
    };

    // --- NEW: Delete Handler ---
    const handleDeleteFare = async (id) => {
        if (!window.confirm(`Are you sure you want to delete Fare ID ${id}? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteFare(id); // Call the newly available deleteFare function
            alert(`Fare ID ${id} deleted successfully.`);
            fetchFares(); // Refresh the list
        } catch (error) {
            console.error("Error deleting fare:", error);
            alert(`Failed to delete fare: ${error.message}`);
        }
    };
    // ----------------------------

    // --- Form Submission Handler (Updated for Add/Edit) ---
    const handleFormSubmit = async (fareData) => {
        try {
            if (editingFare) {
                // UPDATE logic
                await updateFare(editingFare.id, fareData); // Call updateFare
                alert(`Fare ID ${editingFare.id} updated successfully.`);
            } else {
                // ADD logic
                await addFare(fareData); // Call addFare
                alert("New fare added successfully.");
            }
            
            // Cleanup and Refresh
            setEditingFare(null); 
            setIsFormVisible(false);
            fetchFares(); 
        } catch (error) {
            console.error("Error submitting fare:", error);
            alert(`Submission Failed: ${error.message}`);
        }
    };

    // --- Table Rendering Logic ---
    const renderTable = () => {
        if (loading) return <p>Loading fares and applying markup...</p>;
        if (fares.length === 0) return <p>No fares found. {searchLocation.from ? 'Try clearing the search.' : ''}</p>;

        const firstFare = fares[0];
        // Ensure markupType exists before trying to display it
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
            
            {/* FIX 1: Convert fare.fare to a Number before calling toFixed() */}
            <td>₹{Number(fare.fare).toFixed(2)}</td> 
            
            {/* FIX 2: Apply the same fix to markupValue and finalFare just in case */}
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

            {/* --- Form Modal/Display (Now passes initialData for editing) --- */}
            {isFormVisible && (
                <div className="fare-form-modal">
                    <FareForm 
                        initialData={editingFare} // Pass the fare object if editing, or null if adding
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