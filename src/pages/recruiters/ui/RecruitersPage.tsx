import { useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Space, Title } from '@mantine/core';
import { SearchRecruiter } from '@/features/search-recruiter';
import { useRecruiterControllerFindAll } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { CenteredError, CenteredLoader } from '@/shared/ui';
import { RecruitersList } from '@/widgets/recruiters-list';

const RecruitersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: recruitersResponse, isLoading, error } = useRecruiterControllerFindAll();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recruiters = Array.isArray(recruitersResponse?.data) ? recruitersResponse.data : [];

  const filteredRecruiters = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return recruiters.filter(
      (recruiter) =>
        recruiter?.firstName?.toLowerCase()?.includes(query) ||
        recruiter?.lastName?.toLowerCase()?.includes(query) ||
        recruiter?.email?.toLowerCase()?.includes(query)
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
