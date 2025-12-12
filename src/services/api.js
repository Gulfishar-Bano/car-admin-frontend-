
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Fetch all cars
export const getCars = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/cars/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
};

// ADD CAR (multipart)
export const addCar = async (formData) => {
  return axios.post(
    `${BASE_URL}/cars/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};



export const editCar = async (id, formDataInstance) => {

  console.log("FormData received in editCar:", formDataInstance); // Log the object
  
  
  return axios.put(`${BASE_URL}/cars/update/${id}`, formDataInstance, {
    headers: {
    
      'Content-Type': 'multipart/form-data', 
    },
  });
};



// DELETE CAR
export const deleteCar = async (carId) => {
  const response = await fetch(`${BASE_URL}/cars/delete/${carId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete car ${carId}. Status: ${response.status}`);
  }

  return true;
};


export const getBrands = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/car-brand/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

// CAR TYPES
export const getCarTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/car-type/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching car types:", error);
    return [];
  }
};

// DRIVERS
export const getDrivers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/driver/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return [];
  }
};

export const deleteDriver = async (driverId) => {
    const response = await fetch(`${BASE_URL}/driver/delete/${driverId}`, {
        method: "DELETE",
    });
    // Check for success (200, 204)
    if (!response.ok) {
        // If the service returns a 400 with a message, read it
        if (response.status === 400) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || "Failed to delete driver due to client error.");
        }
        throw new Error("Failed to delete driver");
    }
};

export const editDriver = async (driverId, data) => {
    const response = await fetch(`${BASE_URL}/driver/update/${driverId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to edit driver");
    return response.json();
};

export const addDriver = async (data) => {
    const response = await fetch(`${BASE_URL}/driver/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to add driver");
    return response.json();
};

// SEARCH FARES
export const searchFares = async (queryParams) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
    params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching fares:", error);
    return [];
  }


  


}


  
export const getFare = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fare/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fares:", error);
    return [];
  }
};

export const addFare = async (formData) => {
  return axios.post(
    `${BASE_URL}/fare/create`,
    formData)
   
};

export const getFares = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fare/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fares:", error);
    return [];
  }
};



// 3. UPDATE EXISTING FARE (U) - NEW FUNCTION
export const updateFare = async (id, fareData) => {
  try {
    const response = await axios.put(`${BASE_URL}/fare/update/${id}`, fareData);
    return response.data;
  } catch (error) {
    console.error(`Error updating fare ${id}:`, error);
    throw new Error(error.response?.data?.message || `Failed to update fare ${id}.`);
  }
};

// 4. DELETE FARE (D) - NEW FUNCTION
export const deleteFare = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/fare/delete/${id}`);
    return response.data; 
  } catch (error) {
    console.error(`Error deleting fare ${id}:`, error);
    throw new Error(error.response?.data?.message || `Failed to delete fare ${id}.`);
  }
};


// 5. SEARCH BY AMOUNT
export const findByAmount = async (fareAmount) => {
    try {
        const response = await axios.get(`${BASE_URL}/fare/amount/${fareAmount}`);
        return response.data;
    } catch (error) {
        console.error("Error finding fare by amount:", error);
        return [];
    }
}

// 6. SEARCH BY ROUTE (LOCATION)
export const findByLocation = async (fromLoc, toLoc) => {
    try {
        const response = await axios.get(`${BASE_URL}/fare/route`, {
            params: { from: fromLoc, to: toLoc },
        });
        return response.data;
    } catch (error) {
        console.error("Error finding fare by location:", error);
        return [];
    }
}