import { useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Space, Title } from '@mantine/core';
import { SearchCompany } from '../../../features/search-company/ui/SearchCompany.tsx';
import { useCompanyControllerFindAll } from '../../../shared/api/generated/endpoints';
import { ROUTES } from '../../../shared/config/routes';
import { CenteredError, CenteredLoader } from '../../../shared/ui/CenteredState';
import { CompaniesList } from '../../../widgets/companies-list';

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, error } = useCompanyControllerFindAll();

  const companies = useMemo(() => data?.data ?? [], [data?.data]);

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
