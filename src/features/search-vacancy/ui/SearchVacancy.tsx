import { IconSearch } from '@tabler/icons-react';
import { TextInput } from '@mantine/core';

interface SearchVacancyProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchVacancy = ({ value, onChange }: SearchVacancyProps) => {
  return (
    <TextInput
      placeholder="Поиск вакансии по названию, номеру или клиенту"
      leftSection={<IconSearch size={16} />}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      size="xl"
    />
  );
};
