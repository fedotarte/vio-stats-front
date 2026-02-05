import { lazy } from 'react';

export const HomePage = lazy(() => import('@/pages/home/ui/HomePage'));
export const CreateRecruiterDrawerRoute = lazy(
  () => import('@/pages/home/ui/CreateRecruiterDrawerRoute')
);
export const CreateVacancyDrawerRoute = lazy(
  () => import('@/pages/home/ui/CreateVacancyDrawerRoute')
);
export const CreateClientDrawerRoute = lazy(
  () => import('@/pages/home/ui/CreateClientDrawerRoute')
);
export const RecruitersPage = lazy(() => import('@/pages/recruiters/ui/RecruitersPage'));
export const VacanciesPage = lazy(() => import('@/pages/vacancies/ui/VacanciesPage'));
export const ClientsPage = lazy(() => import('@/pages/clients/ui/ClientsPage'));
export const RecruiterDetailPage = lazy(
  () => import('@/pages/recruiter-detail/ui/RecruiterDetailPage')
);
export const RecruiterAssignmentDrawerRoute = lazy(
  () => import('@/pages/recruiter-detail/ui/RecruiterAssignmentDrawerRoute')
);
export const RecruiterEditDrawerRoute = lazy(
  () => import('@/pages/recruiter-detail/ui/RecruiterEditDrawerRoute')
);
export const VacancyDrawerRoute = lazy(
  () => import('@/pages/vacancies/ui/VacancyDrawerRoute')
);
export const VacancyEditDrawerRoute = lazy(
  () => import('@/pages/vacancies/ui/VacancyEditDrawerRoute')
);
export const CompanyEditPage = lazy(() => import('@/pages/company-edit/ui/CompanyEditPage'));
export const CompanyDetailRedirect = lazy(
  () => import('@/pages/company-edit/ui/CompanyDetailRedirect')
);
