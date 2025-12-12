import React, { useState, useEffect } from 'react';
import { getCars } from '../../services/api'; // Import the function to fetch cars
import './FareForm.css'; // Assuming you create a corresponding CSS file

// --- Static Placeholder Markup (Simulating the MarkupService logic) ---
// This must be replaced with a real API call if the markup is dynamic.
const PLACEHOLDER_MARKUP = {
    type: 'percentage', // Could be 'fixed'
    value: 10,          // 10% or 10 units
};

const calculateFinalFare = (baseFare, markup) => {
    if (isNaN(baseFare) || baseFare <= 0) return 0;

    let markupValue = 0;
    if (markup.type === 'percentage') {
        markupValue = baseFare * (markup.value / 100);
    } else if (markup.type === 'fixed') {
        markupValue = markup.value;
    }

    return baseFare + markupValue;
};
// ---------------------------------------------------------------------

const FareForm = ({ initialData, onSubmit, onCancel }) => {
    const isEditMode = initialData && initialData.id;
    const [carOptions, setCarOptions] = useState([]);
    const [loadingCars, setLoadingCars] = useState(true);
    
    const [formData, setFormData] = useState({
        // Use carId from related car object if editing
        carId: initialData?.car?.id?.toString() || '', 
        FromLocation: initialData?.FromLocation || '',
        ToLocation: initialData?.ToLocation || '',
        fare: initialData?.fare?.toString() || '', // Base fare
    });

    // --- State for Real-Time Price Preview ---
    const [finalFare, setFinalFare] = useState(0); 

    // 1. Fetch Car Options
    useEffect(() => {
        const fetchCarsData = async () => {
            setLoadingCars(true);
            try {
                const cars = await getCars();
                setCarOptions(cars);
            } catch (error) {
                console.error("Failed to load cars for form:", error);
            } finally {
                setLoadingCars(false);
            }
        };
        fetchCarsData();
    }, []);

    // 2. Calculate Final Fare on input change
    useEffect(() => {
        const baseFare = Number(formData.fare);
        setFinalFare(calculateFinalFare(baseFare, PLACEHOLDER_MARKUP));
    }, [formData.fare]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simple client-side validation
        if (!formData.carId || !formData.FromLocation || !formData.ToLocation || !Number(formData.fare)) {
            alert("Please fill in all required fields.");
            return;
        }

        // Prepare data for submission (ensure fare is a number and carId is number)
        const dataToSubmit = {
            ...formData,
            fare: Number(formData.fare),
            carId: Number(formData.carId),
        };

        // Call the parent's onSubmit handler (which handles addFare or updateFare)
        onSubmit(dataToSubmit);
    };

    if (loadingCars) {
        return <div className="loading-state">Loading form dependencies...</div>;
    }

    return (
        <div className="fare-form-container">
            <h3 className="form-title">
                {isEditMode ? "Edit Fare (ID: " + initialData.id + ")" : "Add New Fare"}
            </h3>
            
            <form onSubmit={handleSubmit}>
                
                {/* Input 1: Car Selection */}
                <div className="form-group">
                    <label htmlFor="carId">Car</label>
                    <select
                        id="carId"
                        name="carId"
                        value={formData.carId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select a Car</option>
                        {carOptions.map(car => (
                            <option key={car.id} value={car.id}>
                                {car.name} ({car.plateNumber})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Input 2: From Location */}
                <div className="form-group">
                    <label htmlFor="FromLocation">From Location</label>
                    <input type="text" name="FromLocation" value={formData.FromLocation} onChange={handleChange} required />
                </div>

                {/* Input 3: To Location */}
                <div className="form-group">
                    <label htmlFor="ToLocation">To Location</label>
                    <input type="text" name="ToLocation" value={formData.ToLocation} onChange={handleChange} required />
                </div>

                {/* Input 4: Base Fare */}
                <div className="form-group">
                    <label htmlFor="fare">Base Fare (₹)</label>
                    <input 
                        type="number" 
                        name="fare" 
                        value={formData.fare} 
                        onChange={handleChange} 
                        required 
                        min="0"
                        step="0.01" 
                    />
                </div>
                
                {/* --- UNIQUE FEATURE: Price Preview --- */}
                <div className="price-preview">
                    <h4>Price Preview</h4>
                    <div className="preview-details">
                        <p>Base Fare:</p>
                        <p>₹{Number(formData.fare || 0).toFixed(2)}</p>
                    </div>
                    <div className="preview-details markup">
                        <p>Markup ({PLACEHOLDER_MARKUP.type === 'percentage' ? `${PLACEHOLDER_MARKUP.value}%` : `Fixed ₹${PLACEHOLDER_MARKUP.value}`}):</p>
                        <p>+ ₹{(finalFare - Number(formData.fare || 0)).toFixed(2)}</p>
                    </div>
                    <div className="preview-details total">
                        <p>Final Price:</p>
                        <p className="final-amount">₹{finalFare.toFixed(2)}</p>
                    </div>
                </div>
                {/* -------------------------------------- */}

                <div className="form-actions">
                    <button type="submit" className="btn-primary">
                        {isEditMode ? "Update Fare" : "Save Fare"}
                    </button>
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FareForm;