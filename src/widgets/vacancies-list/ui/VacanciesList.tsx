import { ScrollArea, Stack } from '@mantine/core';
import { VacancyCard } from '@/entities/vacancy';
import type { VacancyResponseDto } from '@/shared/api';

interface VacanciesListProps {
  vacancies: VacancyResponseDto[];
  onVacancyClick: (vacancy: VacancyResponseDto) => void;
}

export const VacanciesList = ({ vacancies, onVacancyClick }: VacanciesListProps) => {
  return (
    <ScrollArea h="calc(100vh - 300px)">
      <Stack gap="md">
        {vacancies.map((vacancy) => (
          <VacancyCard key={vacancy.id} vacancy={vacancy} onClick={() => onVacancyClick(vacancy)} />
        ))}
      </Stack>
    </ScrollArea>
  );
};
