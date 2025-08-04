import type { Appointment, AppointmentRequest } from "../types";
import apiClient from "./apiClient";

export async function getAppointments(
  nutritionistId: string,
): Promise<Appointment[]> {
  const response = await apiClient.get(
    `/nutritionists/${nutritionistId}/appointments`,
  );
  return response.data;
}

export async function createAppointment(
  appointment: AppointmentRequest,
): Promise<Response> {
  const response = await apiClient.post("/appointments", {
    appointment: appointment,
  });
  return response.data;
}

export async function acceptAppointment(id: string): Promise<Response> {
  const response = await apiClient.patch(`/appointments/${id}/accept`, {});
  return response.data;
}

// Decline an appointment
export async function declineAppointment(id: string): Promise<Response> {
  const response = await apiClient.patch(`/appointments/${id}/refuse`, {});
  return response.data;
}
