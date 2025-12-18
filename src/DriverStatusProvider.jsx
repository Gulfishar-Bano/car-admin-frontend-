// src/App.js (Example structure)
import { DriverStatusProvider } from './pages/Drivers/DriverStatusContext';
// ... other imports

function App() {
    return (
        <DriverStatusProvider>
            <SidebarLayout>
                {/* Your routing logic here, ensuring Dashboard and DriverList are inside */}
                {/* <Routes> */}
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* <Route path="/drivers" element={<DriverList />} /> */}
                {/* </Routes> */}
            </SidebarLayout>
        </DriverStatusProvider>
    );
}

export default App;