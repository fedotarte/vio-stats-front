import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../shared/config/routes';

const HomePage = lazy(() => import('../../pages/home/ui/HomePage'));
const RecruiterDetailPage = lazy(
  () => import('../../pages/recruiter-detail/ui/RecruiterDetailPage')
);
const CompanyEditPage = lazy(
  () => import('../../pages/company-edit/ui/CompanyEditPage').then((m) => ({ default: m.default }))
);
const CompanyDetailRedirect = lazy(
  () =>
    import('../../pages/company-edit/ui/CompanyDetailRedirect').then((m) => ({
      default: m.CompanyDetailRedirect,
    }))
);

const homeRoute = (path: string, children?: RouteObject[]): RouteObject => ({
  path,
  element: <HomePage />,
  children,
});

export const appRoutes: RouteObject[] = [
  { path: ROUTES.root, element: <Navigate to={ROUTES.recruiters.root} replace /> },
  {
    path: ROUTES.recruiters.detail(),
    element: <RecruiterDetailPage />,
    children: [
      { path: 'edit', element: null },
      { path: 'assignments/:assignmentId', element: <RecruiterDetailPage /> },
    ],
  },
  homeRoute(ROUTES.recruiters.root, [{ path: 'create', element: null }]),
  homeRoute(ROUTES.vacancies.root, [
    { path: 'create', element: null },
    { path: ':id', element: null, children: [{ path: 'edit', element: null }] },
  ]),
  homeRoute(ROUTES.clients.root, [{ path: 'create', element: null }]),
  { path: 'company/:companyId/edit', element: <CompanyEditPage /> },
  { path: 'company/:companyId', element: <CompanyDetailRedirect /> },
  { path: '*', element: <Navigate to={ROUTES.recruiters.root} replace /> },
];
