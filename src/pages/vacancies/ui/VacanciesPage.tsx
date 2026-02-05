import { useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Space, Title } from '@mantine/core';
import { SearchVacancy } from '../../../features/search-vacancy/ui/SearchVacancy.tsx';
import { useVacancyControllerFindAll } from '../../../shared/api/generated/endpoints';
import { ROUTES } from '../../../shared/config/routes';
import type { VacancyEntity } from '../../../shared/types';
import { CenteredError, CenteredLoader } from '../../../shared/ui/CenteredState';
import { VacanciesList } from '../../../widgets/vacancies-list';

const VacanciesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: vacanciesResponse, isLoading, error } = useVacancyControllerFindAll();

  const vacancies = useMemo(() => vacanciesResponse?.data ?? [], [vacanciesResponse?.data]);

  const filteredVacancies = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return vacancies.filter(
      (vacancy) =>
        vacancy.title.toLowerCase().includes(query) ||
        (vacancy.description?.toLowerCase().includes(query) ?? false)
    );
  }, [searchQuery, vacancies]);

  const handleVacancyClick = useCallback(
    (vacancy: VacancyEntity) => {
      navigate(ROUTES.vacancies.detail(vacancy.id));
    },
    [navigate]
  );

  if (isLoading) {
    return <CenteredLoader />;
  }

  if (error) {
    return <CenteredError message="Ошибка загрузки вакансий" />;
  }

  return (
    <>
      <Title order={2} mb="xl">
        Все вакансии
      </Title>
      <SearchVacancy value={searchQuery} onChange={setSearchQuery} />
      <Space h="sm" />
      <VacanciesList vacancies={filteredVacancies} onVacancyClick={handleVacancyClick} />
      <Outlet context={{ vacancies }} />
    </>
  );
};

export default VacanciesPage;
