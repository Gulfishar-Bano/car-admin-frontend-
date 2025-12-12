// src/pages/AddCar.jsx
import { addCar } from "../../services/api";
import CarForm from "./CarForm";
import { useNavigate } from "react-router-dom";

const AddCar = () => {
  const navigate = useNavigate();

 const handleSubmit = async (formData) => {
  const res = await addCar(formData); // send FormData directly

  if (res) {
    alert("Car successfully added!");
    navigate("/cars");
  }
};


  return <CarForm onSubmit={handleSubmit} />;
};

export default AddCar;
