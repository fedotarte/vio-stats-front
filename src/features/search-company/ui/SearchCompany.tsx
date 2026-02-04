import { IconSearch } from '@tabler/icons-react';
import { TextInput } from '@mantine/core';

interface SearchCompanyProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchCompany = ({ value, onChange }: SearchCompanyProps) => (
  <TextInput
    placeholder="Поиск клиента"
    leftSection={<IconSearch size={16} />}
    value={value}
    onChange={(event) => onChange(event.currentTarget.value)}
    size="xl"
  />
);
