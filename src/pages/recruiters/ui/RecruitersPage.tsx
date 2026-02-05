import { useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Space, Title } from '@mantine/core';
import { SearchRecruiter } from '../../../features/search-recruiter';
import { useRecruiterControllerFindAll } from '../../../shared/api/generated/endpoints';
import { ROUTES } from '../../../shared/config/routes';
import { CenteredError, CenteredLoader } from '../../../shared/ui/CenteredState';
import { RecruitersList } from '../../../widgets/recruiters-list';

const RecruitersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, error } = useRecruiterControllerFindAll();

  const recruiters = useMemo(() => data?.data ?? [], [data?.data]);

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
    return <CenteredLoader />;
  }

  if (error) {
    return <CenteredError message="Ошибка загрузки рекрутеров" />;
  }

  return (
    <>
      <Title order={2} mb="xl">
        Все рекрутеры
      </Title>
      <SearchRecruiter value={searchQuery} onChange={setSearchQuery} />
      <Space h="sm" />
      <RecruitersList recruiters={filteredRecruiters} onRecruiterClick={handleRecruiterClick} />
      <Outlet />
    </>
  );
};

export default RecruitersPage;
