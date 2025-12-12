import React, { useState, useEffect } from "react";
import "./DriverForm.css";

// Helper function to format date for input[type="date"]
const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; 
    } catch (e) {
        return "";
    }
};

const DriverForm = ({ initialData, onSubmit }) => {
    const isEditMode = initialData && initialData.id;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        licence: "",
        validity: "",
        phone: "", // Keep as string for better handling
        isActive: true,
        
        ...initialData,
        
        // Ensure phone is a string for consistency
        phone: initialData?.phone ? String(initialData.phone) : "",
        validity: formatDateForInput(initialData?.validity),
    });

    // --- NEW: State for validation errors ---
    const [errors, setErrors] = useState({});
    // ----------------------------------------

    useEffect(() => {
        setFormData({
            firstName: "",
            lastName: "",
            licence: "",
            validity: "",
            phone: "",
            isActive: true,
            ...initialData,
            phone: initialData?.phone ? String(initialData.phone) : "",
            validity: formatDateForInput(initialData?.validity),
        });
        setErrors({}); // Clear errors when initialData changes
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
        
        // Clear the specific error field as the user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // --- NEW: Validation Logic Function ---
    const validateForm = () => {
        let newErrors = {};
        const phoneRegex = /^\d{10}$/; // Simple 10-digit check (adjust as needed)

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First Name is required.";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last Name is required.";
        }
        if (!formData.licence.trim()) {
            newErrors.licence = "License Number is required.";
        }
        if (!formData.validity) {
            newErrors.validity = "License Expiry Date is required.";
        }
        
        // Phone number validation: checks if it's 10 digits
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone Number is required.";
        } else if (!phoneRegex.test(formData.phone.trim())) {
            newErrors.phone = "Phone Number must be exactly 10 digits.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // --------------------------------------

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Stop submission if validation fails
            console.log("Validation failed:", errors);
            return;
        }

        try {
            let submissionDate = null;
            if (formData.validity) {
                // Ensure the date is sent as YYYY-MM-DD string for MySQL DATE column
                submissionDate = new Date(formData.validity).toISOString().split('T')[0];
            }
            
            // Note: The backend change to VARCHAR/string for phone is assumed here.
            // If the backend uses BIGINT, you might need to use Number(formData.phone) here.
            const dataToSubmit = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                licence: formData.licence,
                validity: submissionDate, 
                phone: formData.phone.trim(), // Send as string, trimmed
                isActive: formData.isActive,
                ...(isEditMode && { id: initialData.id }) // Include ID only for edit mode
            };
            
            onSubmit(dataToSubmit);
        } catch (error) {
            console.error("Form submission failed:", error);
            alert("An error occurred during form submission.");
        }
    };

    return (
        <form className="driver-form" onSubmit={handleSubmit}>
            <h3 className="form-title">
                {isEditMode ? "Edit Driver Details" : "Add New Driver"}
            </h3>

            {/* Input 1: First Name */}
            <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                {/* NEW: Error display */}
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
            </div>

            {/* Input 2: Last Name */}
            <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
            </div>
            
            {/* Input 3: License Number (licence) */}
            <div className="form-group">
                <label htmlFor="licence">License Number</label>
                <input
                    type="text"
                    id="licence"
                    name="licence"
                    value={formData.licence}
                    onChange={handleChange}
                    required
                />
                {errors.licence && <p className="error-message">{errors.licence}</p>}
            </div>

            {/* Input 4: License Expiry Date (validity) */}
            <div className="form-group">
                <label htmlFor="validity">License Expiry Date</label>
                <input
                    type="date"
                    id="validity"
                    name="validity"
                    value={formData.validity}
                    onChange={handleChange}
                    required
                />
                {errors.validity && <p className="error-message">{errors.validity}</p>}
            </div>

            {/* Input 5: Phone */}
            <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    // Use a pattern attribute for initial HTML validation hint
                    pattern="[0-9]{10}" 
                    title="Phone number must be exactly 10 digits"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                {/* NEW: Error display for phone */}
                {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

            {/* Checkbox: Active Status */}
            <div className="form-group form-group-checkbox">
                <label htmlFor="isActive">Active Status</label>
                <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                />
            </div>

            <button type="submit" className="form-submit-btn">
                {isEditMode ? "Update Driver" : "Save Driver"}
            </button>
        </form>
    );
};

export default DriverForm;