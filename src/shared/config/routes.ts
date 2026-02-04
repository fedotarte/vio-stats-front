export const ROUTES = {
  root: '/',
  recruiters: {
    root: '/recruiters',
    create: '/recruiters/create',
    detail: (recruiterId = ':recruiterId') => `/recruiters/${recruiterId}`,
    edit: (recruiterId = ':recruiterId') => `/recruiters/${recruiterId}/edit`,
    assignment: (recruiterId = ':recruiterId', assignmentId = ':assignmentId') =>
      `/recruiters/${recruiterId}/assignments/${assignmentId}`,
  },
  vacancies: {
    root: '/vacancies',
    create: '/vacancies/create',
    detail: (vacancyId = ':id') => `/vacancies/${vacancyId}`,
    edit: (vacancyId = ':id') => `/vacancies/${vacancyId}/edit`,
  },
  clients: {
    root: '/clients',
    create: '/clients/create',
  },
  company: {
    detail: (companyId = ':companyId') => `/company/${companyId}`,
    edit: (companyId = ':companyId') => `/company/${companyId}/edit`,
  },
} as const;
