import { Select, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { CompanyResponseDto } from '@/shared/api';

interface CompanySelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  companies?: CompanyResponseDto[] | undefined;
}

export const CompanySelect = ({ companies = [], value, onChange }: CompanySelectProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const data = [
    { value: '0', label: 'Все' },
    ...companies.map((company) => ({
      value: company.id,
      label: company.name,
    })),
  ];

  return (
    <Select
      comboboxProps={isMobile ? { withinPortal: false, position: 'top', zIndex: 301 } : undefined}
      label="Выберите компанию"
      placeholder="Выберите компанию из списка"
      data={data}
      value={value ?? '0'}
      onChange={onChange}
      searchable
      clearable
      maxDropdownHeight={280}
    />
  );
};
