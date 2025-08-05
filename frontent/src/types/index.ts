export interface Nutritionist {
  id: string;
  name: string;
  title: string;
}

export interface Appointment {
  id: string;
  guest: Guest;
  event_date: string;
  nutritionist_service: NutritionistService;
}

export interface Guest {
  name: string;
}

export interface Service {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  city: string;
  full_address: string;
}

export interface NutritionistService {
  id: string;
  pricing: number;
  nutritionist: Nutritionist;
  service: Service;
  location: Location;
  delivery_method: DeliveryMethod;
}

export type DeliveryMethod = "in_person" | "online";

export interface AppointmentRequest {
  guest_attributes: {
    name: string;
    email: string;
  };
  nutritionist_service_id: string;
  event_date: string;
}

export interface AppointmentForm {
  guest_attributes: {
    name: string;
    email: string;
  };
  event_date: string;
}

export interface PaginationData {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
}
