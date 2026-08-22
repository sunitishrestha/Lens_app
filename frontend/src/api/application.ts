import { apiRequest } from "./client";

export type Application = {
  id: number;
  vacancy_id: number;
  applicant_id: number;
  status: string;
  applied_at: string;
};

export type Applicant = {
  application_id: number;
  status: string;
  applied_at: string;
  applicant_id: number;
  full_name: string;
  email: string;
};

export const applyToVacancy = (vacancy_id: number) =>
  apiRequest<Application>("/applications", {
    method: "POST",
    body: JSON.stringify({ vacancy_id }),
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
