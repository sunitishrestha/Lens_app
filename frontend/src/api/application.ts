import { apiRequest } from "./client";

export type Application = {
  id: number;
  vacancy_id: number;
  applicant_id: number;
  status: string;
  applied_at: string;
  portfolio_link?: string | null;
  message?: string | null;
  confirmed_availability?: boolean;
  equipment?: string[];
};

export type Applicant = {
  application_id: number;
  status: string;
  applied_at: string;
  applicant_id: number;
  full_name: string;
  email: string;
  portfolio_link?: string | null;
  message?: string | null;
  equipment?: string[];
};

export type ApplicationCreatePayload = {
  vacancy_id: number;
  portfolio_link?: string;
  message?: string;
  confirmed_availability?: boolean;
  equipment?: string[];
};

export const applyToVacancy = (payload: ApplicationCreatePayload) =>
  apiRequest<Application>("/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const myApplications = () =>
  apiRequest<Application[]>("/applications/me");

export const applicantsForVacancy = (vacancyId: number) =>
  apiRequest<Applicant[]>(`/applications/vacancy/${vacancyId}`);

export const updateApplicationStatus = (
  applicationId: number,
  status: string,
) =>
  apiRequest<Application>(`/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
