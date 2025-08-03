export interface Nutritionist {
  id: string;
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
}

export type ApiResponse = NutritionistService[];

export interface AppointmentForm {
  name: string;
  email: string;
  date: string;
  time: string;
}
