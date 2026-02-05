import { useOutletContext } from 'react-router-dom';
import type { VacancyEntity } from '../../../shared/types';

export type VacanciesOutletContext = {
  vacancies: VacancyEntity[];
};

export const useVacanciesOutletContext = () => useOutletContext<VacanciesOutletContext>();
