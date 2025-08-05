import { useState } from "react";
import Input from "./Input";
import { Calendar, X, Mail, User, Clock } from "lucide-react";
import type {
  AppointmentForm,
  NutritionistServiceWithNutritionist,
} from "../types";
import Button from "./Button";
import Modal from "./Modal";
import { createAppointment } from "../api/appointments";
import { useNotification } from "../context/useNotification";
import { useTranslation } from "react-i18next";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNutritionist: NutritionistServiceWithNutritionist | null;
}

interface FormErrors {
  guest?: {
    email?: string[];
    name?: string[];
  };
  event_date?: string[];
  general?: string[];
  time?: string[];
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedNutritionist,
}) => {
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
    guest_attributes: {
      name: "",
      email: "",
    },
    event_date: "",
  });

  const [timeInput, setTimeInput] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { t } = useTranslation();

  const resetForm = (): void => {
    setAppointmentForm({
      guest_attributes: { name: "", email: "" },
      event_date: "",
    });
    setTimeInput("");
    setErrors({});
    setSubmitSuccess(false);
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const submitAppointment = async (): Promise<void> => {
    if (selectedNutritionist === null) return;
    setErrors((prev) => ({ ...prev, general: undefined }));

    setIsSubmitting(true);

    try {
      const eventDateTime = `${appointmentForm.event_date}T${timeInput}:00`;

      await createAppointment({
        ...appointmentForm,
        nutritionist_service_id: selectedNutritionist.id,
        event_date: eventDateTime,
      });

      setSubmitSuccess(true);
      showNotification(t("notifications.appointment.success"), "success");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data &&
        "errors" in error.response.data
      ) {
        setErrors(error.response.data.errors as FormErrors);
      } else {
        setErrors({ general: [t("errors.general")] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {t("appointmentModal.title")}
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
                  {t("appointmentModal.success.title")}
                </p>
                <p className="text-green-700 text-sm mt-1">
                  {t("appointmentModal.success.message")}
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
                label={t("appointmentModal.form.fullName")}
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
                    guest: {
                      ...prev.guest,
                      name: [],
                    },
                  }));
                }}
                placeholder={t("appointmentModal.form.fullName")}
                icon={<User className="w-5 h-5 text-gray-400" />}
                iconPosition="left"
                errors={errors.guest?.name}
                disabled={isSubmitting}
              />

              <Input
                label={t("appointmentModal.form.email")}
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
                    guest: {
                      ...prev.guest,
                      email: [],
                    },
                  }));
                }}
                placeholder={t("appointmentModal.form.email_placeholder")}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                iconPosition="left"
                errors={errors.guest?.email}
                disabled={isSubmitting}
              />

              <Input
                label={t("appointmentModal.form.date")}
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

              <Input
                label={t("appointmentModal.form.time")}
                type="time"
                value={timeInput}
                onChange={(e) => {
                  setTimeInput(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    time: undefined,
                  }));
                }}
                icon={<Clock className="w-5 h-5 text-gray-400" />}
                iconPosition="left"
                errors={errors.time}
                disabled={isSubmitting}
              />

              <div className="flex space-x-4 pt-6">
                <Button
                  onClick={handleClose}
                  variant="orange"
                  disabled={isSubmitting}
                >
                  {t("appointmentModal.buttons.cancel")}
                </Button>
                <Button
                  onClick={submitAppointment}
                  variant="green"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("appointmentModal.buttons.submitting")
                    : t("appointmentModal.buttons.submit")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentModal;
