import { useCallback } from "react";

import PendingAppointmentCard from "./PendingAppointmentCard";
import { useState, useEffect } from "react";
import PendingAppointmentModal from "./PendingAppointmentModal";
import type { Appointment } from "../types";
import { useParams } from "react-router-dom";
import { useNotification } from "../context/useNotification";
import {
  acceptAppointment,
  getPaginatedAppointments,
  rejectAppointment,
} from "../api/appointments";
import Pagination from "./Pagination";
import { useTranslation } from "react-i18next";

const PendingAppointments: React.FC = () => {
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  const refreshAppointments = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    getPaginatedAppointments(id, currentPage, perPage)
      .then((response) => {
        setPendingAppointments(response.appointments);
        setTotalPages(response.pagination.total_pages);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, currentPage, perPage]);

  useEffect(() => {
    refreshAppointments();
  }, [id, currentPage, updateTrigger, refreshAppointments]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCurrentAppointments = () => {
    return pendingAppointments;
  };

  const handleAnswerRequest = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleAccept = async (appointmentId: string) => {
    try {
      console.log(`Accepting appointment with ID: ${appointmentId}`);
      await acceptAppointment(appointmentId);
      setIsModalOpen(false);
      setUpdateTrigger((prev) => prev + 1);
      showNotification(t("notifications.acceptAppointment.success"), "success");
    } catch (error) {
      console.error("Error accepting appointment:", error);
      showNotification(t("notifications.acceptAppointment.failure"), "error");
    }
  };

  const handleReject = async (appointmentId: string) => {
    try {
      console.log(`Declining appointment with ID: ${appointmentId}`);
      await rejectAppointment(appointmentId);
      setIsModalOpen(false);
      setUpdateTrigger((prev) => prev + 1);
      showNotification(t("notifications.rejectAppointment.success"), "success");
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      showNotification(t("notifications.rejectAppointment.failure"), "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-1">
                {t("pendingAppointments.title")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("pendingAppointments.subtitle")}
              </p>
            </div>
          </div>

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

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          )}

          <div className="text-center mt-4 text-sm text-gray-500">
            {loading
              ? t("pendingAppointments.loading")
              : t("pendingAppointments.page", {
                  current: currentPage,
                  total: totalPages,
                })}
          </div>
        </div>
      </div>

      <PendingAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={currentAppointment}
        onAccept={handleAccept}
        onDecline={handleReject}
      />
    </div>
  );
};

export default PendingAppointments;
