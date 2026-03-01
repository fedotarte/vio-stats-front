import { useOutletContext } from 'react-router-dom';
import type { VacancyResponseDto } from '@/shared/api';

export type VacanciesOutletContext = {
  vacancies: VacancyResponseDto[];
};

export const useVacanciesOutletContext = () => useOutletContext<VacanciesOutletContext>();
