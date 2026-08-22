import { apiRequest } from "./client";

export type Vacancy = {
  id: number;
  hirer_id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  price: string;
  status: string;
  created_at: string;
  applicant_count: number;
};

export type VacancyCreatePayload = {
  title: string;
  category: string;
  description: string;
  location: string;
  price: string;
};

export const createVacancy = (payload: VacancyCreatePayload) =>
  apiRequest<Vacancy>("/vacancies", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const listVacancies = () => apiRequest<Vacancy[]>("/vacancies");

export const myVacancies = () => apiRequest<Vacancy[]>("/vacancies/mine");

export const getVacancy = (id: number) =>
  apiRequest<Vacancy>(`/vacancies/${id}`);
