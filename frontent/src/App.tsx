import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import PendingAppointments from "./components/PendingAppointments";
import NutritionistSearch from "./components/NutritionistSearch";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <div className="w-full min-h-screen">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<NutritionistSearch />} />
            <Route
              path="/pending_appointments/:id"
              element={<PendingAppointments />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </NotificationProvider>
  );
}

export default App;
