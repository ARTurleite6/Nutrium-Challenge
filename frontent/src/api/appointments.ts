import type { Appointment, AppointmentRequest, PaginationData } from "../types";
import apiClient from "./apiClient";
import i18n from "../i18n";

export type GetAppointmentsResponse = {
  appointments: Appointment[];
  pagination: PaginationData;
};

export async function getAppointments(
  nutritionistId: string,
  page?: number,
  perPage?: number,
): Promise<Appointment[]> {
  const queryParams: string[] = [];

  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (perPage) {
    queryParams.push(`per_page=${perPage}`);
  }

  const url = `/nutritionists/${nutritionistId}/appointments${
    queryParams.length > 0 ? `?${queryParams.join("&")}` : ""
  }`;

  const response = await apiClient.get(url);
  return response.data;
}

export async function getPaginatedAppointments(
  nutritionistId: string,
  page: number = 1,
  perPage: number = 10,
): Promise<GetAppointmentsResponse> {
  const queryParams = [
    `page=${page}`,
    `per_page=${perPage}`,
    `locale=${i18n.language}`,
  ];
  const url = `/nutritionists/${nutritionistId}/appointments?${queryParams.join("&")}`;

  const response = await apiClient.get(url);
  return response.data;
}

export async function createAppointment(
  appointment: AppointmentRequest,
): Promise<Response> {
  const response = await apiClient.post(
    `/appointments?locale=${i18n.language}`,
    {
      appointment: appointment,
    },
  );
  return response.data;
}

export async function acceptAppointment(id: string): Promise<Response> {
  const response = await apiClient.patch(
    `/appointments/${id}/accept?locale=${i18n.language}`,
    {},
  );
  return response.data;
}

// Decline an appointment
export async function rejectAppointment(id: string): Promise<Response> {
  const response = await apiClient.patch(
    `/appointments/${id}/reject?locale=${i18n.language}`,
    {},
  );
  return response.data;
}
