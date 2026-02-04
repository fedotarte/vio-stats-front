import { IconSearch } from '@tabler/icons-react';
import { TextInput, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface SearchRecruiterProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchRecruiter = ({ value, onChange }: SearchRecruiterProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  return (
    <TextInput
      placeholder="Поиск рекрутера по имени или email"
      leftSection={<IconSearch size={16} />}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      size={isMobile ? 'sm' : 'xl'}
    />
  );
};
