import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../shared/config/routes';
import {
  ClientsPage,
  CompanyDetailRedirect,
  CompanyEditPage,
  CreateClientDrawerRoute,
  CreateRecruiterDrawerRoute,
  CreateVacancyDrawerRoute,
  HomePage,
  RecruiterAssignmentDrawerRoute,
  RecruiterDetailPage,
  RecruiterEditDrawerRoute,
  RecruitersPage,
  VacanciesPage,
  VacancyDrawerRoute,
  VacancyEditDrawerRoute,
} from '.';

const homeRoute = (
  path: string,
  indexElement: RouteObject['element'],
  children?: RouteObject[]
): RouteObject => ({
  path,
  element: <HomePage />,
  children: [
    {
      path: '',
      element: indexElement,
      children,
    },
  ],
});

export const appRoutes: RouteObject[] = [
  { path: ROUTES.root, element: <Navigate to={ROUTES.recruiters.root} replace /> },
  {
    path: ROUTES.recruiters.detail(),
    element: <RecruiterDetailPage />,
    children: [
      { path: 'edit', element: <RecruiterEditDrawerRoute /> },
      { path: 'assignments/:assignmentId', element: <RecruiterAssignmentDrawerRoute /> },
    ],
  },
  homeRoute(ROUTES.recruiters.root, <RecruitersPage />, [
    { path: 'create', element: <CreateRecruiterDrawerRoute /> },
  ]),
  homeRoute(ROUTES.vacancies.root, <VacanciesPage />, [
    { path: 'create', element: <CreateVacancyDrawerRoute /> },
    { path: ':id/edit', element: <VacancyEditDrawerRoute /> },
    { path: ':id', element: <VacancyDrawerRoute /> },
  ]),
  homeRoute(ROUTES.clients.root, <ClientsPage />, [
    { path: 'create', element: <CreateClientDrawerRoute /> },
  ]),
  { path: 'company/:companyId/edit', element: <CompanyEditPage /> },
  { path: 'company/:companyId', element: <CompanyDetailRedirect /> },
  { path: '*', element: <Navigate to={ROUTES.recruiters.root} replace /> },
];
