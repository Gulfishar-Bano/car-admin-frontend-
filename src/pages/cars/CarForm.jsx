import { useEffect, useState } from "react";
import { getBrands, getCarTypes, addCar } from "../../services/api"; 
import './CarForm.css';

const CarForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    model: "",
    carNo: "", 
    brandId: "",
    carTypeId: "",
    fuelType: "",          // Added
    noOfSeats: "",         // Added
    description: "",       // Added
    ac: false, 
    image: null,
    ...initialData,
    
    noOfSeats: initialData.noOfSeats ? String(initialData.noOfSeats) : "", 
  });

  const [preview, setPreview] = useState(initialData.imageUrl || "");
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const handleLocalSubmit = (e) => {
    e.preventDefault();

    
    const dataToSubmit = new FormData();
    
    // 2. Iterate over all non-file fields and append them
    for (const key in formData) {
        // Skip the 'image' property (we handle the file below)
        if (key === 'image') continue; 
        
        // Skip null/undefined values
        if (formData[key] === null || formData[key] === undefined) continue;

        // Convert boolean 'ac' to string 'true' or 'false' for FormData/DTO
        let valueToAppend = formData[key];
        if (key === 'ac' && typeof formData[key] === 'boolean') {
            valueToAppend = String(formData[key]); 
        }
        
        // Append all remaining data fields
        dataToSubmit.append(key, valueToAppend);
    }
    
    // 3. Append the image file only if a new file object exists in state
    if (formData.image instanceof File) {
        
        dataToSubmit.append('image', formData.image);
    }
    
  
    onSubmit(dataToSubmit);
  };

  const loadData = async () => {
    try {
      setBrands(await getBrands());
      setTypes(await getCarTypes());
    } catch (error) {
      console.error("Failed to load dependency data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
      return;
    }

    let newValue = value;

    if (name === "ac") {
     
      newValue = value === "true"; 
    } else if (name === "noOfSeats") {
     
      newValue = value ? Number(value) : value;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  return (
    <div className="car-form-container">
      {/* Used h3 styling from the CSS, adding 'form-title' for clarity */}
      <h3 className="form-title">{initialData.id ? 'Edit Car Details' : 'Add New Car'}</h3>
      
      <form onSubmit={handleLocalSubmit}>
        {/* Model */}
        <div className="form-group">
          <label>Model</label>
          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>

        {/* Car Number Field */}
        <div className="form-group">
          <label>Car Number</label>
          <input
            name="carNo"
            value={formData.carNo}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Brand */}
        <div className="form-group">
          <label>Brand</label>
          <select
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option value={b.id} key={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>


       {/* Car Type */}
        <div className="form-group">
          <label>Car Type</label>
          <select
            name="carTypeId"
            value={formData.carTypeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            {types.map((t) => (
              <option value={t.id} key={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
       
        <div style={{ display: 'flex', gap: '20px' }}>
          
          <div className="form-group" style={{ flex: 1 }}>
              <label>Fuel Type</label>
              <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
              >
                  <option value="">Select Fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="CNG">CNG</option>
              </select>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
              <label>No. of Seats</label>
              <input
                  type="number"
                  name="noOfSeats"
                  value={formData.noOfSeats}
                  onChange={handleChange}
                  min="2"
                  max="9" 
                  required
              />
          </div>
        </div>
      
        {/* Description / Key Features */}
        <div className="form-group">
            <label>Description / Key Features</label>
            <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required 
            />
        </div>
        
        {/* AC Availability (Radio Group) */}
        <div className="form-group">
          <label>AC Availability</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="ac"
                value="true" 
                checked={formData.ac === true}
                onChange={handleChange}
              />
              AC Available
            </label>
            <label>
              <input
                type="radio"
                name="ac"
                value="false"
                checked={formData.ac === false}
                onChange={handleChange}
              />
              Non-AC
            </label>
          </div>
        </div>

        {/* Car Image */}
        <div className="form-group">
          <label>Car Image</label>
          <input type="file" onChange={handleChange} />
        </div>

        
        {preview && (
          <img
            src={preview}
            alt="Car Preview"
            className="car-preview" 
          />
        )}

        <button className="save-btn" type="submit">
          {initialData.id ? 'Save Changes' : 'Add Car'}
        </button>
      </form>
    </div>
  );
};

export default CarForm;