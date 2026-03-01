import { ScrollArea, Stack } from '@mantine/core';
import { CompanyCard } from '@/entities/company';
import type { CompanyResponseDto } from '@/shared/api';

interface CompaniesListProps {
  companies: CompanyResponseDto[];
  onCompanyClick: (companyId: string) => void;
}

export const CompaniesList = ({ companies, onCompanyClick }: CompaniesListProps) => (
  <ScrollArea h="calc(100vh - 300px)">
    <Stack gap="md">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onClick={() => onCompanyClick(company.id)}
        />
      ))}
    </Stack>
  </ScrollArea>
);
