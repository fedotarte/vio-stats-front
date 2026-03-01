import { useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Space, Title } from '@mantine/core';
import { SearchCompany } from '@/features/search-company/ui/SearchCompany.tsx';
import { useCompanyControllerFindAll } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { CenteredError, CenteredLoader } from '@/shared/ui';
import { CompaniesList } from '@/widgets/companies-list';

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: companiesResponse, isLoading, error } = useCompanyControllerFindAll();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const companies = Array.isArray(companiesResponse?.data) ? companiesResponse.data : [];

  const filteredCompanies = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company?.email?.toLowerCase().includes(query) ||
        company?.phone?.toLowerCase().includes(query) ||
        company?.address?.toLowerCase().includes(query)
    );
  }, [searchQuery, companies]);

  const handleCompanyClick = (companyId: string) => {
    navigate(ROUTES.company.edit(companyId));
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
        Все компании
      </Title>
      <SearchCompany value={searchQuery} onChange={setSearchQuery} />
      <Space h="sm" />
      <CompaniesList companies={filteredCompanies} onCompanyClick={handleCompanyClick} />
      <Outlet />
    </>
  );
};

export default ClientsPage;
