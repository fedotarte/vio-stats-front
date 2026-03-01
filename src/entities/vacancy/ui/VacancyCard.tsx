import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import type { VacancyResponseDto } from '@/shared/api';

interface VacancyCardProps {
  vacancy: VacancyResponseDto;
  onClick: () => void;
}

export const VacancyCard = ({ vacancy, onClick }: VacancyCardProps) => {
  const { deadlineDate, deadLineColor } = useMemo(
    () => ({
      deadlineDate: vacancy.deadline
        ? new Date(vacancy.deadline).toLocaleDateString('ru-RU')
        : null,
      deadLineColor: dayjs(vacancy.deadline).isBefore(dayjs(), 'day') ? 'red' : 'orange',
    }),
    [vacancy.deadline]
  );

  const companyName = vacancy?.company?.name;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={700} size="lg">
            {vacancy.title}
          </Text>
          {deadlineDate && (
            <Badge color={deadLineColor} variant="light">
              до {deadlineDate}
            </Badge>
          )}
        </Group>
        {vacancy.description && (
          <Text size="sm" c="dimmed">
            {vacancy.description}
          </Text>
        )}
        <Group gap="sm">
          <Text size="xs" c="dimmed">
            Создано: {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}
          </Text>
          {companyName && (
            <Badge variant="light" color="violet">
              {companyName}
            </Badge>
          )}
        </Group>
      </Stack>
    </Card>
  );
};
