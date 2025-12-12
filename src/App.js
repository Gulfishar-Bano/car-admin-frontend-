import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./component/protectedRoute";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import AddCar from "./pages/cars/AddCar";
import SidebarLayout from "./layout/SidebarLayout"; 
import CarList from "./pages/cars/CarList";
import DriverList from "./pages/Drivers/DriverList";
import FareList from "./pages/fares/FareList";



function App() {
  return (
    <BrowserRouter>
      <Routes>

      
        <Route path="/login" element={<Login />} />

      
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SidebarLayout /> 
            </ProtectedRoute>
          }
        >
          
          <Route index element={<Dashboard />} /> 
          
         
          <Route path="/dashboard" element={<Dashboard />} /> 
          
        <Route path="/cars" element={<CarList />} />
       
    <Route path="/cars/add" element={<AddCar />} />
     <Route path="/drivers" element={<DriverList />} />

      <Route path="/fares" element={<FareList />} />

         
        </Route>

      </Routes>
    </BrowserRouter>
  );
}


export default App;