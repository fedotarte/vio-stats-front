import dayjs from 'dayjs';
import { Card, Text, Group, Badge, Stack } from '@mantine/core';
import type { VacancyEntity } from '../../../shared/types';

interface VacancyCardProps {
  vacancy: VacancyEntity;
  onClick: () => void;
}

export const VacancyCard = ({ vacancy, onClick }: VacancyCardProps) => {
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
          {vacancy.deadline && (
            <Badge
              color={dayjs(vacancy.deadline).isBefore(dayjs(), 'day') ? 'red' : 'orange'}
              variant="light"
            >
              до {new Date(vacancy.deadline).toLocaleDateString('ru-RU')}
            </Badge>
          )}
        </Group>
        {vacancy.description && (
          <Text size="sm" c="dimmed">
            {vacancy.description}
          </Text>
        )}
        <Text size="xs" c="dimmed">
          Создано: {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </Card>
  );
};
