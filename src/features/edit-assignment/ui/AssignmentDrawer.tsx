import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Group, Loader, NumberInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  getAssignmentControllerFindAllQueryKey,
  getAssignmentControllerFindByIdQueryKey,
  useAssignmentControllerDelete,
  useAssignmentControllerFindById,
  useAssignmentControllerUpdate,
  type AssignedVacancyRecruiterDto,
  type UpdateAssignmentDto,
} from '@/shared/api';
import { ResponsiveDrawer } from '@/shared/ui';

interface AssignmentDrawerProps {
  assignmentId: string | null;
  assignment?: AssignedVacancyRecruiterDto | null;
  opened: boolean;
  onCloseAssignmentDrawer: () => void;
  initialEditing?: boolean;
}

interface AssignmentFormValues {
  requiredResumes: number;
  sentResumes: number;
  acceptedResumes: number;
  rejectedResumes: number;
}

export const AssignmentDrawer = ({
  assignmentId,
  assignment: assignmentFromList,
  opened,
  onCloseAssignmentDrawer,
  initialEditing = false,
}: AssignmentDrawerProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(initialEditing);

  const { data: assignmentResponse, isFetching } = useAssignmentControllerFindById(
    assignmentId ?? '',
    { query: { enabled: Boolean(assignmentId) } }
  );

  const assignment = useMemo(
    () => assignmentResponse?.data ?? assignmentFromList ?? null,
    [assignmentFromList, assignmentResponse?.data]
  );

  const { mutate: updateAssignment, isPending } = useAssignmentControllerUpdate({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Успешно',
          message: 'Назначение обновлено',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getAssignmentControllerFindAllQueryKey() });
        if (assignmentId) {
          queryClient.invalidateQueries({
            queryKey: getAssignmentControllerFindByIdQueryKey(assignmentId),
          });
        }
        setIsEditing(false);
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось обновить назначение',
          color: 'red',
        });
      },
    },
  });

  const { mutate: deleteAssignment, isPending: isDeleting } = useAssignmentControllerDelete({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Успешно',
          message: 'Назначение удалено',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getAssignmentControllerFindAllQueryKey() });
        if (assignmentId) {
          queryClient.invalidateQueries({
            queryKey: getAssignmentControllerFindByIdQueryKey(assignmentId),
          });
        }
        onCloseAssignmentDrawer();
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось удалить назначение',
          color: 'red',
        });
      },
    },
  });

  const form = useForm<AssignmentFormValues>({
    initialValues: {
      requiredResumes: 0,
      sentResumes: 0,
      acceptedResumes: 0,
      rejectedResumes: 0,
    },
  });

  useEffect(() => {
    if (assignment) {
      form.setValues({
        requiredResumes: assignment.requiredResumes ?? 0,
        sentResumes: assignment.sentResumes ?? 0,
        acceptedResumes: assignment.acceptedResumes ?? 0,
        rejectedResumes: assignment.rejectedResumes ?? 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment]);

  useEffect(() => {
    setIsEditing(initialEditing);
  }, [initialEditing, opened]);

  const handleSave = (values: AssignmentFormValues) => {
    if (!assignment) return;
    const dto: UpdateAssignmentDto = {
      requiredResumes: values.requiredResumes,
      sentResumes: values.sentResumes,
      acceptedResumes: values.acceptedResumes,
      rejectedResumes: values.rejectedResumes,
    };
    updateAssignment({ id: assignment.id, data: dto });
  };

  const handleCancel = () => {
    if (assignment) {
      form.setValues({
        requiredResumes: assignment.requiredResumes ?? 0,
        sentResumes: assignment.sentResumes ?? 0,
        acceptedResumes: assignment.acceptedResumes ?? 0,
        rejectedResumes: assignment.rejectedResumes ?? 0,
      });
    }
    setIsEditing(false);
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Удалить назначение?',
      centered: true,
      children: <Text size="sm">Вы точно хотите удалить назначение? Это действие необратимо.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (assignment?.id) {
          deleteAssignment({ id: assignment.id });
        }
      },
    });

  const isBusy = isPending || isDeleting;

  return (
    <ResponsiveDrawer
      opened={opened}
      onClose={() => {
        setIsEditing(false);
        onCloseAssignmentDrawer();
      }}
      title={isEditing ? 'Редактирование назначения' : 'Просмотр назначения'}
      mobileSize="70%"
      desktopSize="md"
      mobilePadding="lg"
      desktopPadding="md"
      transitionProps={{ transition: 'slide-left', duration: 200, timingFunction: 'ease' }}
    >
      {!assignment ? null : isFetching ? (
        <Loader color="violet" />
      ) : (
        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack gap="md">
            {isEditing ? (
              <>
                <NumberInput
                  label="Нужно резюме"
                  min={0}
                  clampBehavior="strict"
                  decimalScale={0}
                  {...form.getInputProps('requiredResumes')}
                />
                <NumberInput
                  label="Отправлено резюме"
                  min={0}
                  clampBehavior="strict"
                  decimalScale={0}
                  {...form.getInputProps('sentResumes')}
                />
                <NumberInput
                  label="Согласовано резюме"
                  min={0}
                  clampBehavior="strict"
                  decimalScale={0}
                  {...form.getInputProps('acceptedResumes')}
                />
                <NumberInput
                  label="Отклонено резюме"
                  min={0}
                  clampBehavior="strict"
                  decimalScale={0}
                  {...form.getInputProps('rejectedResumes')}
                />
                <Group justify="flex-end" mt="md">
                  <Button variant="outline" onClick={handleCancel} disabled={isBusy}>
                    Отмена
                  </Button>
                  <Button type="submit" loading={isPending}>
                    Сохранить
                  </Button>
                </Group>
              </>
            ) : (
              <>
                <div>
                  <Text fw={700} size="xl">
                    {assignment.vacancy?.title ?? 'Без названия'}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {assignment.vacancy?.company?.name ?? 'Компания не указана'}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Рекрутер: {assignment.recruiter?.firstName} {assignment.recruiter?.lastName}
                  </Text>
                </div>

                <Group gap="xs">
                  <Badge color="blue" variant="light">
                    Нужно: {assignment.requiredResumes}
                  </Badge>
                  <Badge color="gray" variant="light">
                    Отправлено: {assignment.sentResumes}
                  </Badge>
                  <Badge color="green" variant="light">
                    Согласовано: {assignment.acceptedResumes}
                  </Badge>
                  <Badge color="red" variant="light">
                    Отклонено: {assignment.rejectedResumes}
                  </Badge>
                </Group>

                <div>
                  <Text size="xs" c="dimmed">
                    Создано: {new Date(assignment.createdAt).toLocaleDateString('ru-RU')}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Обновлено: {new Date(assignment.updatedAt).toLocaleDateString('ru-RU')}
                  </Text>
                </div>

                <Button onClick={() => setIsEditing(true)} fullWidth>
                  Редактировать назначение
                </Button>
                <Button
                  onClick={openDeleteModal}
                  color="red"
                  variant="outline"
                  fullWidth
                  loading={isDeleting}
                  disabled={isBusy}
                >
                  Удалить назначение
                </Button>
              </>
            )}
          </Stack>
        </form>
      )}
    </ResponsiveDrawer>
  );
};
