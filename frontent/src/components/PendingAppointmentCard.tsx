import { Calendar, Clock } from "lucide-react";
import type { Appointment } from "../types";

interface Props {
  appointment: Appointment;
  onAnswerRequest: (appointment: Appointment) => void;
}

const PendingAppointmentCard: React.FC<Props> = ({
  appointment,
  onAnswerRequest,
}) => {
  // Format the date string for display
  const formattedDate = new Date(appointment.event_date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  // Extract time from the date string
  const formattedTime = new Date(appointment.event_date).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-w-0">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
          {appointment.guest.name.charAt(0)}
        </div>

        {/* Request Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1">
            {appointment.guest.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {appointment.nutritionist_service.service.name}
          </p>

          {/* Date and Time */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Answer Request Button */}
          <button
            onClick={() => onAnswerRequest(appointment)}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium hover:underline"
          >
            Answer request
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingAppointmentCard;
