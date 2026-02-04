import { Stack, ScrollArea } from '@mantine/core';
import { VacancyCard } from '../../../entities/vacancy';
import { type VacancyEntity } from '../../../shared/types';

interface VacanciesListProps {
  vacancies: VacancyEntity[];
  onVacancyClick: (vacancy: VacancyEntity) => void;
}

export const VacanciesList = ({ vacancies, onVacancyClick }: VacanciesListProps) => {
  return (
    <ScrollArea h="calc(100vh - 300px)">
      <Stack gap="md">
        {vacancies.map((vacancy) => (
          <VacancyCard
            key={vacancy.id}
            vacancy={vacancy}
            onClick={() => onVacancyClick(vacancy)}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};
