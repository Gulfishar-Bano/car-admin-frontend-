import React, { useEffect, useState } from "react";
import { getCars, deleteCar, editCar, addCar } from "../../services/api";
import CarForm from "./CarForm";
import "./CarList.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Load cars at beginning
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await getCars();
      setCars(data);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    }
  };

  // Reset everything after Add / Edit
  const resetView = () => {
    setEditingCar(null);
    setShowForm(false);
    fetchCars();
  };

  // Delete a car
  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await deleteCar(carId);
        fetchCars();
      } catch (error) {
        console.error("Failed to delete car:", error);
        alert("Failed to delete car.");
      }
    }
    setDropdownOpen(null); // close dropdown
  };

  // Dropdown toggle
  const handleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <div className="carlist-container">
      {/* TOP BUTTONS */}
      <div className="carlist-buttons">
        <button
          className={!showForm ? "carlist-btn active" : "carlist-btn"}
          onClick={resetView}
        >
          Car List
        </button>

        <button
          className={showForm && !editingCar ? "carlist-btn active" : "carlist-btn"}
          onClick={() => {
            setEditingCar(null); // empty form
            setShowForm(true);
          }}
        >
          + Add Car
        </button>
      </div>

      {/* FORM SECTION */}
      {showForm && (
        <div className="carlist-card">
          <CarForm
            initialData={editingCar || {}}
            onSubmit={
              editingCar
                ? async (formData) => {
                  console.log("fordata",editingCar.id)
                  console.log("fordate",formData)
                    await editCar(editingCar.id, formData);
                    resetView();
                  }
                : async (formData) => {
                    await addCar(formData);
                    resetView();
                  }
            }
          />
        </div>
      )}

      {/* TABLE SECTION */}
      {!showForm && (
        <div className="carlist-card">
          <h2 className="carlist-title">Car Inventory</h2>

          <table className="carlist-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Car No</th>
                <th>Seats</th>
                <th>AC</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {cars.map((car) => (
                <tr
                  key={car.id}
                  className={dropdownOpen === car.id ? "action-col dropup-mode" : "action-col"}
                >
                  <td>{car.model}</td>
                  <td>{car.carNo}</td>
                  <td>{car.noOfSeats}</td>
                  <td>{car.ac ? "Yes" : "No"}</td>

                  <td className="action-col">
                    <button
                      className="action-btn"
                      onClick={() => handleDropdown(car.id)}
                    >
                      Action
                    </button>

                    {dropdownOpen === car.id && (
                      <div className="action-menu">
                        {/* EDIT */}

                        <p
                          onClick={() => {
                            setEditingCar(car); // fill form
                            setShowForm(true);  // show form
                            setDropdownOpen(null);
                          }}
                        >
                          Edit
                        </p>

                        {/* DELETE */}
                        <p onClick={() => handleDelete(car.id)}>Delete</p>
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

export default CarList;
