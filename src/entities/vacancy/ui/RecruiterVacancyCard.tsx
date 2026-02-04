import { useMemo } from 'react';
import dayjs from 'dayjs';
import {
  Badge,
  Card,
  Group,
  RingProgress,
  Stack,
  Text,
  type DefaultMantineColor,
} from '@mantine/core';
import type { AssignedVacancyRecruiterDto } from '../../../shared/api/generated/models';

interface RecruiterVacancyCardProps {
  recruiterVacancy: AssignedVacancyRecruiterDto;
  onClick: () => void;
}

export const RecruiterVacancyCard = ({ recruiterVacancy, onClick }: RecruiterVacancyCardProps) => {
  const vacancy = recruiterVacancy.vacancy;

  // API возвращает полный объект VacancyEntity в поле vacancy

  const efficiencyPercent = useMemo(() => {
    if (recruiterVacancy.requiredResumes <= 0) return 0;
    return Math.min(
      100,
      Math.round((recruiterVacancy.sentResumes / recruiterVacancy.requiredResumes) * 100)
    );
  }, [recruiterVacancy.requiredResumes, recruiterVacancy.sentResumes]);

  const relevancePercent = useMemo(() => {
    if (recruiterVacancy.sentResumes <= 0) return 0;
    return Math.min(
      100,
      Math.round((recruiterVacancy.acceptedResumes / recruiterVacancy.sentResumes) * 100)
    );
  }, [recruiterVacancy.acceptedResumes, recruiterVacancy.sentResumes]);

  const getProgressColor = (value: number): DefaultMantineColor => {
    if (value < 30) return 'red';
    if (value < 70) return 'yellow';
    return 'green';
  };

  const colorByAcceptedAndRejected = useMemo<DefaultMantineColor>(() => {
    if (recruiterVacancy.rejectedResumes > 0 && recruiterVacancy.sentResumes > 0) {
      const rejectedPercent =
        Math.round((recruiterVacancy.rejectedResumes / recruiterVacancy.sentResumes) * 100) / 100;
      if (rejectedPercent > 0.5) {
        return 'red';
      }
      if (rejectedPercent <= 0.5) {
        return 'orange';
      }
    }
    if (recruiterVacancy.acceptedResumes > 0) {
      return 'green';
    }

    return 'blue';
  }, [
    recruiterVacancy.rejectedResumes,
    recruiterVacancy.sentResumes,
    recruiterVacancy.acceptedResumes,
  ]);

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
            {vacancy?.title || 'Без названия'}
          </Text>
          {vacancy?.deadline && (
            <Badge
              color={dayjs(vacancy.deadline).isBefore(dayjs(), 'day') ? 'red' : 'orange'}
              variant="light"
            >
              до {new Date(vacancy.deadline).toLocaleDateString('ru-RU')}
            </Badge>
          )}
        </Group>

        {vacancy?.title && (
          <Text size="sm" c="dimmed">
            {vacancy?.title}
          </Text>
        )}

        <Group gap="xs" mt="xs">
          <Badge color="blue" variant="light">
            Нужно: {recruiterVacancy.requiredResumes}
          </Badge>
          <Badge color="gray" variant="light">
            Отправлено: {recruiterVacancy.sentResumes}
          </Badge>
          <Badge color={colorByAcceptedAndRejected} variant="light">
            Согласовано/Отклонено: {recruiterVacancy.acceptedResumes}/
            {recruiterVacancy.rejectedResumes}
          </Badge>
        </Group>

        <Group gap="lg" mt="xs">
          <Stack gap={4} align="center">
            <RingProgress
              size={84}
              thickness={8}
              sections={[
                { value: efficiencyPercent, color: getProgressColor(efficiencyPercent) },
              ]}
              label={
                <Text fw={700} size="xs" ta="center">
                  {efficiencyPercent}%
                </Text>
              }
            />
            <Text size="xs" c="dimmed">
              Эффективность
            </Text>
            <Text size="xs" c="dimmed">
              {recruiterVacancy.sentResumes}/{recruiterVacancy.requiredResumes}
            </Text>
          </Stack>
          <Stack gap={4} align="center">
            <RingProgress
              size={84}
              thickness={8}
              sections={[{ value: relevancePercent, color: getProgressColor(relevancePercent) }]}
              label={
                <Text fw={700} size="xs" ta="center">
                  {relevancePercent}%
                </Text>
              }
            />
            <Text size="xs" c="dimmed">
              Релевантность
            </Text>
            <Text size="xs" c="dimmed">
              {recruiterVacancy.acceptedResumes}/{recruiterVacancy.sentResumes}
            </Text>
          </Stack>
        </Group>

        <Text size="xs" c="dimmed">
          Создано: {new Date(recruiterVacancy?.createdAt).toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </Card>
  );
};
