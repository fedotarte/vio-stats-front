import { useOutletContext } from 'react-router-dom';
import type { AssignedVacancyRecruiterDto, RecruiterEntity } from '../../../shared/api/generated/models';

export type RecruiterDetailOutletContext = {
  recruiterId: string;
  recruiter: RecruiterEntity | null;
  recruiterVacancies: AssignedVacancyRecruiterDto[] | undefined;
};

export const useRecruiterDetailOutletContext = () =>
  useOutletContext<RecruiterDetailOutletContext>();
