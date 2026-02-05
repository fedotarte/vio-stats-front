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

const buildPath = (basePath: string, fullPath: string) => {
  if (!fullPath.startsWith(basePath)) {
    return fullPath;
  }
  return fullPath.slice(basePath.length).replace(/^\//, '');
};

export const appRoutes: RouteObject[] = [
  { path: ROUTES.root, element: <Navigate to={ROUTES.recruiters.root} replace /> },
  {
    path: ROUTES.recruiters.detail(),
    element: <RecruiterDetailPage />,
    children: [
      {
        path: buildPath(ROUTES.recruiters.detail(), ROUTES.recruiters.edit()),
        element: <RecruiterEditDrawerRoute />,
      },
      {
        path: buildPath(ROUTES.recruiters.detail(), ROUTES.recruiters.assignment()),
        element: <RecruiterAssignmentDrawerRoute />,
      },
    ],
  },
  homeRoute(ROUTES.recruiters.root, <RecruitersPage />, [
    {
      path: buildPath(ROUTES.recruiters.root, ROUTES.recruiters.create),
      element: <CreateRecruiterDrawerRoute />,
    },
  ]),
  homeRoute(ROUTES.vacancies.root, <VacanciesPage />, [
    {
      path: buildPath(ROUTES.vacancies.root, ROUTES.vacancies.create),
      element: <CreateVacancyDrawerRoute />,
    },
    {
      path: buildPath(ROUTES.vacancies.root, ROUTES.vacancies.edit()),
      element: <VacancyEditDrawerRoute />,
    },
    {
      path: buildPath(ROUTES.vacancies.root, ROUTES.vacancies.detail()),
      element: <VacancyDrawerRoute />,
    },
  ]),
  homeRoute(ROUTES.clients.root, <ClientsPage />, [
    {
      path: buildPath(ROUTES.clients.root, ROUTES.clients.create),
      element: <CreateClientDrawerRoute />,
    },
  ]),
  { path: ROUTES.company.edit(), element: <CompanyEditPage /> },
  { path: ROUTES.company.detail(), element: <CompanyDetailRedirect /> },
  { path: '*', element: <Navigate to={ROUTES.recruiters.root} replace /> },
];
