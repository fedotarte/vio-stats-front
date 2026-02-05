import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Center, Loader, Space, Text, Title } from '@mantine/core';
import { VacancyDrawer } from '../../../features/edit-vacancy';
import { SearchVacancy } from '../../../features/search-vacancy/ui/SearchVacancy.tsx';
import { useVacancyControllerFindAll } from '../../../shared/api/generated/endpoints';
import { ROUTES } from '../../../shared/config/routes';
import type { VacancyEntity } from '../../../shared/types';
import { VacanciesList } from '../../../widgets/vacancies-list';

export const VacanciesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: vacanciesResponse, isLoading, error } = useVacancyControllerFindAll();

  const vacancies = useMemo(() => {
    const payload = vacanciesResponse?.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray((payload as { data?: VacancyEntity[] }).data)) {
      return (payload as { data: VacancyEntity[] }).data;
    }
    return [];
  }, [vacanciesResponse?.data]);

  const location = useLocation();

  const drawerState = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts[0] !== 'vacancies' || pathParts[1] === 'create') {
      return { opened: false, isEditing: false, vacancyId: null };
    }
    if (pathParts[1]) {
      return { opened: true, isEditing: pathParts[2] === 'edit', vacancyId: pathParts[1] };
    }
    return { opened: false, isEditing: false, vacancyId: null };
  }, [location.pathname]);

  // Определяем выбранную вакансию по ID из URL
  const selectedVacancy = useMemo(() => {
    if (!drawerState.vacancyId) return null;
    return vacancies.find((v) => v.id === drawerState.vacancyId) ?? null;
  }, [drawerState.vacancyId, vacancies]);

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

  const handleDrawerClose = useCallback(() => {
    navigate(ROUTES.vacancies.root);
  }, [navigate]);

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h={200}>
        <Text c="red">Ошибка загрузки вакансий</Text>
      </Center>
    );
  }

  return (
    <>
      <Title order={2} mb="xl">
        Все вакансии
      </Title>
      <SearchVacancy value={searchQuery} onChange={setSearchQuery} />
      <Space h="sm" />
      <VacanciesList vacancies={filteredVacancies} onVacancyClick={handleVacancyClick} />
      <VacancyDrawer
        vacancy={selectedVacancy}
        opened={drawerState.opened}
        onCloseVacancyDrawer={handleDrawerClose}
        initialEditing={drawerState.isEditing}
      />
    </>
  );
};
