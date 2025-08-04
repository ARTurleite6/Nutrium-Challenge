export interface Nutritionist {
  id: string;
  name: string;
  title: string;
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

export type ApiResponse = NutritionistService[];

export interface AppointmentForm {
  guest_attributes: {
    name: string;
    email: string;
  };
  event_date: string;
}
