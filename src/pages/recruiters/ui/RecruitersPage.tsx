import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Center, Loader, Space, Text, Title } from '@mantine/core';
import { SearchRecruiter } from '../../../features/search-recruiter';
import { useRecruiterControllerFindAll } from '../../../shared/api/generated/endpoints';
import { ROUTES } from '../../../shared/config/routes';
import type { RecruiterEntity } from '../../../shared/types';
import { RecruitersList } from '../../../widgets/recruiters-list';

export const RecruitersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, error } = useRecruiterControllerFindAll();

  const recruiters = useMemo(() => {
    const payload = data?.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray((payload as { data?: RecruiterEntity[] }).data)) {
      return (payload as { data: RecruiterEntity[] }).data;
    }
    return [];
  }, [data?.data]);

  const filteredRecruiters = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return recruiters.filter(
      (recruiter) =>
        recruiter.firstName.toLowerCase().includes(query) ||
        recruiter.lastName.toLowerCase().includes(query) ||
        recruiter.email.toLowerCase().includes(query)
    );
  }, [searchQuery, recruiters]);

  const handleRecruiterClick = (recruiterId: string) => {
    navigate(ROUTES.recruiters.detail(recruiterId));
  };

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
        <Text c="red">Ошибка загрузки рекрутеров</Text>
      </Center>
    );
  }

  return (
    <>
      <Title order={2} mb="xl">
        Все рекрутеры
      </Title>
      <SearchRecruiter value={searchQuery} onChange={setSearchQuery} />
      <Space h="sm" />
      <RecruitersList recruiters={filteredRecruiters} onRecruiterClick={handleRecruiterClick} />
    </>
  );
};
