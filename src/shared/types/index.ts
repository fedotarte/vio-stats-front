// Re-export types from generated API models
export type { RecruiterEntity as Recruiter } from '../api/generated/models';
export type { CompanyEntity as Company } from '../api/generated/models';
export type { VacancyEntity as Vacancy } from '../api/generated/models';

// Also export with original names for direct usage
export type {
  RecruiterEntity,
  CompanyEntity,
  VacancyEntity,
  CreateRecruiterDto,
  CreateVacancyDto,
  CreateCompanyDto,
  UpdateRecruiterDto,
  UpdateVacancyDto,
  UpdateCompanyDto,
} from '../api/generated/models';
