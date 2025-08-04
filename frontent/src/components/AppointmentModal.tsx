import { useState } from "react";
import Input from "./Input";
import { Calendar, X, Mail, User } from "lucide-react";
import type { NutritionistService, AppointmentForm } from "../types";
import Button from "./Button";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNutritionist: NutritionistService | null;
  apiBaseUrl: string;
}

interface FormErrors {
  "guest.email"?: string[];
  "guest.name"?: string[];
  event_date?: string[];
  general?: string[];
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedNutritionist,
  apiBaseUrl,
}) => {
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
    guest_attributes: {
      name: "",
      email: "",
    },
    event_date: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const resetForm = (): void => {
    setAppointmentForm({
      guest_attributes: { name: "", email: "" },
      event_date: "",
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const submitAppointment = async (): Promise<void> => {
    setErrors((prev) => ({ ...prev, general: undefined }));

    if (!selectedNutritionist) {
      setErrors({ general: ["No nutritionist selected"] });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: change this to also include time
      const eventDateTime = appointmentForm.event_date;

      const response = await fetch(`${apiBaseUrl}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment: {
            ...appointmentForm,
            nutritionist_service_id: selectedNutritionist.id,
            event_date: eventDateTime,
          },
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        const errorData = await response.json();

        if (errorData.errors) {
          const serverErrors: FormErrors = errorData.errors;
          setErrors(serverErrors);
        } else {
          setErrors({
            general:
              errorData.message || "Failed to submit appointment request",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      setErrors({
        general: ["Network error. Please check your connection and try again."],
      });
    } finally {
      setIsSubmitting(false);
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
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Appointment request submitted successfully!
              </p>
              <p className="text-green-700 text-sm mt-1">
                You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{errors.general}</p>
            </div>
          )}

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
            <Input
              label="Full Name"
              type="text"
              value={appointmentForm.guest_attributes.name}
              onChange={(e) => {
                setAppointmentForm((prev) => ({
                  ...prev,
                  guest_attributes: {
                    ...prev.guest_attributes,
                    name: e.target.value,
                  },
                }));
                setErrors((prev) => ({
                  ...prev,
                  "guest.name": undefined,
                }));
              }}
              placeholder="Your full name"
              icon={<User className="w-5 h-5 text-gray-400" />}
              iconPosition="left"
              errors={errors["guest.name"]}
              disabled={isSubmitting}
            />

            <Input
              label="Email Address"
              type="email"
              value={appointmentForm.guest_attributes.email}
              onChange={(e) => {
                setAppointmentForm((prev) => ({
                  ...prev,
                  guest_attributes: {
                    ...prev.guest_attributes,
                    email: e.target.value,
                  },
                }));
                setErrors((prev) => ({
                  ...prev,
                  "guest.email": undefined,
                }));
              }}
              placeholder="your.email@example.com"
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              iconPosition="left"
              errors={errors["guest.email"]}
              disabled={isSubmitting}
            />

            <Input
              label="Preferred Date"
              type="date"
              value={appointmentForm.event_date}
              onChange={(e) => {
                setAppointmentForm((prev) => ({
                  ...prev,
                  event_date: e.target.value,
                }));
                setErrors((prev) => ({
                  ...prev,
                  event_date: undefined,
                }));
              }}
              min={new Date().toISOString().split("T")[0]}
              icon={<Calendar className="w-5 h-5 text-gray-400" />}
              iconPosition="left"
              errors={errors.event_date}
              disabled={isSubmitting}
            />

            <div className="flex space-x-4 pt-6">
              <Button
                onClick={handleClose}
                variant="orange"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={submitAppointment}
                variant="green"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Request Appointment"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
