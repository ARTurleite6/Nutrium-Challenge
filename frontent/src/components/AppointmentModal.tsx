import { useState } from "react";
import { Calendar, Clock, X, Mail, User } from "lucide-react";
import type { NutritionistService, AppointmentForm } from "../types";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNutritionist: NutritionistService | null;
  apiBaseUrl: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedNutritionist,
  apiBaseUrl,
}) => {
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
    name: "",
    email: "",
    date: "",
    time: "",
  });

  const handleFormChange = (
    field: keyof AppointmentForm,
    value: string,
  ): void => {
    setAppointmentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = (): void => {
    setAppointmentForm({ name: "", email: "", date: "", time: "" });
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const submitAppointment = async (): Promise<void> => {
    if (
      !appointmentForm.name ||
      !appointmentForm.email ||
      !appointmentForm.date ||
      !appointmentForm.time
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (!selectedNutritionist) {
      alert("No nutritionist selected");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment: {
            guest_attributes: {
              name: appointmentForm.name,
              email: appointmentForm.email,
            },
            nutritionist_service_id: selectedNutritionist.id,
            event_date: `${appointmentForm.date}T${appointmentForm.time}:00`,
          },
        }),
      });

      if (response.ok) {
        alert("Appointment request submitted successfully!");
        handleClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit appointment");
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Error submitting appointment. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Schedule Appointment
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {selectedNutritionist && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {selectedNutritionist.nutritionist.name}
              </h3>
              <p className="text-base text-gray-600 mb-1">
                {selectedNutritionist.service.name}
              </p>
              <p className="text-base font-medium text-green-600 mb-1">
                €{selectedNutritionist.pricing}
              </p>
              <p className="text-sm text-gray-500">
                {selectedNutritionist.location.city}
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={appointmentForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={appointmentForm.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => handleFormChange("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Time
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => handleFormChange("time", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-base"
              >
                Cancel
              </button>
              <button
                onClick={submitAppointment}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-base"
              >
                Request Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
