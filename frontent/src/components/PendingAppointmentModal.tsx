import React from "react";
import Modal from "./Modal";
import type { Appointment } from "../types";

interface PendingAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onAccept: (appointmentId: string) => void;
  onDecline: (appointmentId: string) => void;
}

const PendingAppointmentModal: React.FC<PendingAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onAccept,
  onDecline,
}) => {
  // If there's no appointment, show a placeholder message
  if (!appointment) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Pending Request">
        <div className="text-center py-6">
          <p className="text-gray-500">No request to display.</p>
        </div>
      </Modal>
    );
  }

  // Format date for display
  const formattedDate = new Date(appointment.event_date).toLocaleDateString();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pending Request">
      <div className="w-full">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                {appointment.guest.name}
              </h3>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600">
              {appointment.nutritionist_service.service.name}
            </span>
          </div>

          <div className="my-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              Service Location:{" "}
              {appointment.nutritionist_service.location.full_address}
            </p>
            <p className="text-gray-700">
              Nutritionist:{" "}
              {appointment.nutritionist_service.nutritionist?.name}
            </p>
            <p className="text-gray-700">
              Price: €{appointment.nutritionist_service.pricing}
            </p>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              onClick={() => onDecline(appointment.id)}
            >
              Decline
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              onClick={() => onAccept(appointment.id)}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PendingAppointmentModal;
