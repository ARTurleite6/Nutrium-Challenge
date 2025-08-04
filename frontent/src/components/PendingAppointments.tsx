import { ChevronLeft, ChevronRight, Settings, Share } from "lucide-react";
import PendingAppointmentCard from "./PendingAppointmentCard";
import { useState, useEffect } from "react";
import PendingAppointmentModal from "./PendingAppointmentModal";
import type { Appointment } from "../types";
import { useParams } from "react-router-dom";
import { getAppointments } from "../api/appointments";

const PendingAppointments: React.FC = () => {
  const { id } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(
    [],
  );
  const [, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch appointments from an API
    // For now, use the sample data
    if (!id) return;
    setLoading(true);
    getAppointments(id)
      .then((appointments) => {
        setPendingAppointments(appointments);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(pendingAppointments.length / itemsPerPage);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const getCurrentAppointments = () => {
    const start = currentIndex * itemsPerPage;
    const end = start + itemsPerPage;
    return pendingAppointments.slice(start, end);
  };

  const handleAnswerRequest = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleAccept = (appointmentId: string) => {
    // In a real app, you would call an API to accept the appointment
    console.log(`Accepting appointment with ID: ${appointmentId}`);
    setPendingAppointments(
      pendingAppointments.filter((app) => app.id !== appointmentId),
    );
    setIsModalOpen(false);
  };

  const handleDecline = (appointmentId: string) => {
    // In a real app, you would call an API to decline the appointment
    console.log(`Declining appointment with ID: ${appointmentId}`);
    setPendingAppointments(
      pendingAppointments.filter((app) => app.id !== appointmentId),
    );
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-1">
                Pending Requests
              </h2>
              <p className="text-sm text-gray-500">
                Accept or reject new pending requests
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                disabled={pendingAppointments.length <= itemsPerPage}
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={goToNext}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                disabled={pendingAppointments.length <= itemsPerPage}
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <Share className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Carousel Content */}
          <div className="overflow-hidden">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              {getCurrentAppointments().map((appointment) => (
                <div key={appointment.id} className="flex-1">
                  <PendingAppointmentCard
                    appointment={appointment}
                    onAnswerRequest={() => handleAnswerRequest(appointment)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Page Indicators */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-emerald-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Request Counter */}
          <div className="text-center mt-4 text-sm text-gray-500">
            Showing {getCurrentAppointments().length} of{" "}
            {pendingAppointments.length} requests
          </div>
        </div>
      </div>

      <PendingAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={currentAppointment}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </div>
  );
};

export default PendingAppointments;
