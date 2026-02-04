import { Stack } from '@mantine/core';
import type { AssignedVacancyRecruiterDto } from '../../../shared/api/generated/models';
import { RecruiterVacancyCard } from './RecruiterVacancyCard';

interface RecruiterVacanciesListProps {
  recruiterVacancies: AssignedVacancyRecruiterDto[];
  onVacancyClick: (recruiterVacancy: AssignedVacancyRecruiterDto) => void;
}

export const RecruiterVacanciesList = ({
  recruiterVacancies,
  onVacancyClick,
}: RecruiterVacanciesListProps) => {
  return (
    <Stack gap="md">
      {recruiterVacancies.map((rv) => (
        <RecruiterVacancyCard
          key={rv?.id}
          recruiterVacancy={rv}
          onClick={() => onVacancyClick(rv)}
        />
      ))}
    </Stack>
  );
};
