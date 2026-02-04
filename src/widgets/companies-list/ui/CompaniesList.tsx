import { ScrollArea, Stack } from '@mantine/core';
import { CompanyCard } from '../../../entities/company';
import type { CompanyEntity } from '../../../shared/api/generated/models';

interface CompaniesListProps {
  companies: CompanyEntity[];
  onCompanyClick: (companyId: string) => void;
}

export const CompaniesList = ({ companies, onCompanyClick }: CompaniesListProps) => (
  <ScrollArea h="calc(100vh - 300px)">
    <Stack gap="md">
      {companies.map((c) => (
        <CompanyCard key={c.id} company={c} onClick={() => onCompanyClick(c.id)} />
      ))}
    </Stack>
  </ScrollArea>
);
