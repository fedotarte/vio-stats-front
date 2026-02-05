import 'dayjs/locale/ru';

import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
  type MultiSelectProps,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  getAssignmentControllerFindAllQueryKey,
  getVacancyControllerFindAllQueryKey,
  useAssignmentControllerCreate,
  useAssignmentControllerDelete,
  useAssignmentControllerFindAll,
  useRecruiterControllerFindAll,
  useVacancyControllerDelete,
  useVacancyControllerUpdate,
} from '../../../shared/api/generated/endpoints';
import { ROUTES } from '../../../shared/config/routes';
import type { RecruiterEntity, UpdateVacancyDto, VacancyEntity } from '../../../shared/types';

interface VacancyDrawerProps {
  vacancy: VacancyEntity | null;
  opened: boolean;
  onCloseVacancyDrawer: () => void;
  initialEditing?: boolean;
}

interface VacancyFormValues {
  title: string;
  description: string;
  deadline: Date | null;
  recruiterIds: string[];
  requiredResumes: number;
}

const prepareRecruitersFullName = (recruiter: RecruiterEntity) =>
  `${recruiter.firstName} ${recruiter.lastName}`;

const colorsTuple = [
  'dark',
  'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'green',
  'lime',
  'yellow',
  'orange',
  'teal',
];

const getStableColorForId = (id: string) =>
  colorsTuple[id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colorsTuple.length];

export const VacancyDrawer = ({
  vacancy,
  opened,
  onCloseVacancyDrawer,
  initialEditing = false,
}: VacancyDrawerProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [isEditing, setIsEditing] = useState(initialEditing);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: recruitersData, isFetching: isRecruiterFetching } = useRecruiterControllerFindAll();
  const recruiters = useMemo(() => {
    const payload = recruitersData?.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray((payload as { data?: RecruiterEntity[] }).data)) {
      return (payload as { data: RecruiterEntity[] }).data;
    }
    return [];
  }, [recruitersData?.data]);

  const { data: assignmentsData, isFetching: isAssignmentsFetching } =
    useAssignmentControllerFindAll(
      { vacancyId: vacancy?.id },
      { query: { enabled: !!vacancy?.id } }
    );
  const assignments = useMemo(() => assignmentsData?.data ?? [], [assignmentsData?.data]);

  const currentRecruiterIds = useMemo(() => assignments.map((a) => a.recruiterId), [assignments]);

  const { mutate: updateVacancy, isPending: isVacancyUpdating } = useVacancyControllerUpdate({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Успешно',
          message: 'Вакансия обновлена',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getVacancyControllerFindAllQueryKey() });
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось обновить вакансию',
          color: 'red',
        });
      },
    },
  });

  const { mutateAsync: assignRecruiter, isPending: isAssigning } = useAssignmentControllerCreate({
    mutation: {
      onSuccess: (createdAssignmentResponse) => {
        const vacancyTitle = createdAssignmentResponse?.data?.vacancy?.title;
        const recruiterFullName = `${createdAssignmentResponse?.data?.recruiter?.firstName ?? ''} + ${createdAssignmentResponse?.data?.recruiter?.lastName ?? ''}`;
        notifications.show({
          title: 'Успешно',
          message: `Рекрутер ${recruiterFullName} назначен(а) на вакансию ${vacancyTitle}`,
          color: 'green',
        });
        queryClient.invalidateQueries({
          queryKey: getAssignmentControllerFindAllQueryKey(),
        });
      },
    },
  });

  const { mutateAsync: removeAssignment, isPending: isAssignmentRemoving } =
    useAssignmentControllerDelete({
      mutation: {
        onSuccess: () => {
          notifications.show({
            title: 'Успешно',
            message: 'Назначенная вакансия Удалена',
            color: 'orange',
          });
          queryClient.invalidateQueries({
            queryKey: getAssignmentControllerFindAllQueryKey(),
          });
        },
      },
    });

  const { mutateAsync: deleteVacancy, isPending: isVacancyRemoving } = useVacancyControllerDelete({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Успешно',
          message: 'Вакансия удалена',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getVacancyControllerFindAllQueryKey() });
        onCloseVacancyDrawer();
        navigate(ROUTES.vacancies.root);
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось удалить вакансию',
          color: 'red',
        });
      },
    },
  });

  const form = useForm<VacancyFormValues>({
    initialValues: {
      title: '',
      description: '',
      deadline: null,
      recruiterIds: [],
      requiredResumes: 0,
    },
  });

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Удалить вакансию?',
      centered: true,
      children: <Text size="sm">Вы точно хотите удалить вакансию?</Text>,
      labels: { confirm: 'Удалить вакансию', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Отмена'),
      onConfirm: async () => {
        if (vacancy?.id) {
          await deleteVacancy({ id: vacancy.id });
        }
      },
    });

  // Синхронизируем режим редактирования с URL
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEditing(initialEditing);
  }, [initialEditing, opened]);

  useEffect(() => {
    if (vacancy) {
      form.setValues({
        title: vacancy.title,
        description: vacancy.description || '',
        deadline: vacancy.deadline ? new Date(vacancy.deadline) : null,
        recruiterIds: currentRecruiterIds,
        requiredResumes: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacancy, currentRecruiterIds]);

  const handleEdit = () => {
    if (vacancy) {
      navigate(ROUTES.vacancies.edit(vacancy.id));
    }
  };

  const handleSave = async (formValues: VacancyFormValues) => {
    if (!vacancy) return;

    const updateVacancyDto: UpdateVacancyDto = {
      title: formValues.title,
      description: formValues.description || undefined,
      deadline: formValues.deadline?.toISOString(),
    };
    updateVacancy({ id: vacancy.id, data: updateVacancyDto });

    // Обрабатываем изменения в назначениях рекрутеров
    const newRecruiterIds = formValues.recruiterIds;
    const recruitersToAdd = newRecruiterIds.filter((id) => !currentRecruiterIds.includes(id));
    const recruitersToRemove = currentRecruiterIds.filter((id) => !newRecruiterIds.includes(id));

    // Добавляем новых рекрутеров
    await Promise.allSettled(
      recruitersToAdd.map((recruiterId) =>
        assignRecruiter({
          data: {
            vacancyId: vacancy.id,
            recruiterId,
            requiredResumes: formValues?.requiredResumes ?? 0,
          },
        })
      )
    );

    // Удаляем снятых рекрутеров
    const assignmentsToRemove = assignments.filter((a) =>
      recruitersToRemove.includes(a.recruiterId)
    );
    await Promise.allSettled(
      assignmentsToRemove.map((assignedVacancy) => removeAssignment({ id: assignedVacancy?.id }))
    );

    onCloseVacancyDrawer();
  };

  const handleCancel = () => {
    if (vacancy) {
      form.setValues({
        title: vacancy.title,
        description: vacancy.description || '',
        deadline: vacancy.deadline ? new Date(vacancy.deadline) : null,
        recruiterIds: currentRecruiterIds,
      });
      navigate(ROUTES.vacancies.detail(vacancy.id));
    }
  };

  const renderRecruiterOption: MultiSelectProps['renderOption'] = ({ option, checked }) => (
    <Group justify="space-between" wrap="nowrap">
      <Group wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        <Avatar color={getStableColorForId(option.value)} size={36} radius="xl" />
        <div>
          <Text size="sm">{option.label}</Text>
          <Text size="xs" opacity={0.5}>
            {recruiters?.find((r) => r.id === option.value)?.email}
          </Text>
        </div>
      </Group>
      {checked && <IconCheck size={18} color="var(--mantine-color-green-6)" />}
    </Group>
  );

  const isFetching = isRecruiterFetching || isAssignmentsFetching;
  const isPending = isVacancyUpdating || isAssigning || isAssignmentRemoving || isVacancyRemoving;

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        setIsEditing(false);
        onCloseVacancyDrawer();
      }}
      title={isEditing ? 'Редактирование вакансии' : 'Просмотр вакансии'}
      padding={isMobile ? 'lg' : 'md'}
      position={isMobile ? 'bottom' : 'right'}
      size={isMobile ? '70%' : 'md'}
      transitionProps={{
        transition: 'slide-left',
        duration: 200,
        timingFunction: 'ease',
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      closeButtonProps={{
        size: 'lg',
      }}
      styles={
        isMobile
          ? {
              inner: {
                height: 'auto',
              },
              content: {
                height: 'fit-content',
                maxHeight: '90vh',
              },
            }
          : undefined
      }
    >
      {!vacancy ? null : isFetching ? (
        <Loader color="violet" />
      ) : (
        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack gap="md">
            {isEditing ? (
              <>
                <TextInput
                  label="Название вакансии"
                  placeholder="Введите название"
                  {...form.getInputProps('title')}
                  required
                />
                <Textarea
                  label="Описание"
                  placeholder="Введите описание"
                  minRows={3}
                  {...form.getInputProps('description')}
                />
                <DateInput
                  label="Дедлайн"
                  placeholder="Выберите дату"
                  clearable
                  locale={dayjs.locale('ru')}
                  {...form.getInputProps('deadline')}
                />
                <NumberInput
                  label="Сколько резюме отправить"
                  placeholder="от 0 до 100"
                  clampBehavior="strict"
                  min={0}
                  max={100}
                  decimalScale={0}
                  defaultValue={0}
                  {...form.getInputProps('requiredResumes')}
                />
                <MultiSelect
                  label="Назначенные рекрутеры"
                  placeholder="Введи или выбери"
                  data={recruiters?.map((recruiter) => ({
                    label: prepareRecruitersFullName(recruiter),
                    value: recruiter.id,
                  }))}
                  limit={5}
                  searchable
                  nothingFoundMessage="Не нашли..."
                  renderOption={renderRecruiterOption}
                  comboboxProps={
                    isMobile ? { withinPortal: false, position: 'top', zIndex: 301 } : undefined
                  }
                  {...form.getInputProps('recruiterIds')}
                />
                <Group justify="flex-end" mt="md">
                  <Button variant="outline" onClick={handleCancel} disabled={isPending}>
                    Отмена
                  </Button>
                  <Button type="submit" loading={isPending}>
                    Сохранить
                  </Button>
                </Group>
                <Button
                  onClick={openDeleteModal}
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  variant="outline"
                  fullWidth
                  loading={isVacancyRemoving}
                >
                  Удалить вакансию
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Text fw={700} size="xl">
                    {vacancy.title}
                  </Text>
                  {vacancy.deadline && (
                    <Group gap="xs" mt="sm">
                      <Badge color="orange" size="lg">
                        Дедлайн: {new Date(vacancy.deadline).toLocaleDateString('ru-RU')}
                      </Badge>
                    </Group>
                  )}
                </div>

                {vacancy.description && (
                  <div>
                    <Text fw={600} size="sm" mb="xs">
                      Описание:
                    </Text>
                    <Text size="sm">{vacancy.description}</Text>
                  </div>
                )}

                {assignments.length > 0 && (
                  <div>
                    <Text fw={600} size="sm" mb="xs">
                      Назначенные рекрутеры:
                    </Text>
                    <Group gap="xs">
                      {assignments.map((assignment) => {
                        const recruiter = recruiters?.find((r) => r.id === assignment.recruiterId);
                        return recruiter ? (
                          <Badge key={assignment.id} color="violet" size="lg">
                            {prepareRecruitersFullName(recruiter)}
                          </Badge>
                        ) : null;
                      })}
                    </Group>
                  </div>
                )}

                <div>
                  <Text size="xs" c="dimmed">
                    Создано: {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Обновлено: {new Date(vacancy.updatedAt).toLocaleDateString('ru-RU')}
                  </Text>
                </div>

                <Button onClick={handleEdit} fullWidth>
                  Редактировать
                </Button>
              </>
            )}
          </Stack>
        </form>
      )}
    </Drawer>
  );
};
