import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IconCheck } from '@tabler/icons-react';
import {
  Avatar,
  Button,
  Drawer,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Select,
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
import { notifications } from '@mantine/notifications';
import {
  getVacancyControllerFindAllQueryKey,
  useAssignmentControllerCreate,
  useCompanyControllerFindAll,
  useRecruiterControllerFindAll,
  useVacancyControllerCreate,
} from '../../../shared/api/generated/endpoints';
import type { CompanyEntity, CreateVacancyDto, RecruiterEntity } from '../../../shared/types';

interface CreateVacancyDrawerProps {
  opened: boolean;
  onClose: () => void;
}

interface VacancyFormValues {
  title: string;
  description: string;
  deadline: Date | string | null;
  companyId: string;
  recruiterIds: string[];
  requiredResumes: number;
}

const prepareRecruitersFullName = (recruiter: RecruiterEntity) =>
  `${recruiter.firstName} ${recruiter.lastName}`;

export const CreateVacancyDrawer = ({ opened, onClose }: CreateVacancyDrawerProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const queryClient = useQueryClient();

  const { data: companiesData, isFetching: isCompanyFetching } = useCompanyControllerFindAll();
  const { data: recruitersData, isFetching: isRecruiterFetching } = useRecruiterControllerFindAll();

  const companies = useMemo(() => {
    const payload = companiesData?.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray((payload as { data?: CompanyEntity[] }).data)) {
      return (payload as { data: CompanyEntity[] }).data;
    }
    return [];
  }, [companiesData?.data]);

  const recruiters = useMemo(() => {
    const payload = recruitersData?.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray((payload as { data?: RecruiterEntity[] }).data)) {
      return (payload as { data: RecruiterEntity[] }).data;
    }
    return [];
  }, [recruitersData?.data]);

  const { mutateAsync: assignRecruiter, isPending: isVacancyAssigning } =
    useAssignmentControllerCreate({
      mutation: {
        onSuccess: async (createdAssignmentResponse) => {
          const vacancyName = createdAssignmentResponse?.data?.vacancy?.title;
          const recruiterFullName = `${createdAssignmentResponse?.data?.recruiter?.firstName} ${createdAssignmentResponse?.data?.recruiter?.lastName}`;
          notifications.show({
            title: 'Успешно',
            message: `Вакансия ${vacancyName} назначена на рекрутера ${recruiterFullName}`,
            color: 'green',
          });
          queryClient.invalidateQueries({ queryKey: getVacancyControllerFindAllQueryKey() });
          form.reset();
          onClose();
        },
        onError: () => {
          notifications.show({
            title: 'Ошибка',
            message: 'Не удалось создать вакансию',
            color: 'red',
          });
        },
      },
    });

  const { mutateAsync: createVacancy, isPending: isVacancyCreating } = useVacancyControllerCreate({
    mutation: {
      onSuccess: async (createdVacancyResponse) => {
        notifications.show({
          title: 'Успешно',
          message: `Вакансия ${createdVacancyResponse.data?.title} создана`,
          color: 'green',
        });
        await queryClient.invalidateQueries({ queryKey: getVacancyControllerFindAllQueryKey() });
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось назначить вакансию',
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
      companyId: '',
      recruiterIds: [],
      requiredResumes: 0,
    },
    validate: {
      title: (value) => (!value ? 'Название обязательно' : null),
      companyId: (value) => (!value ? 'Компания обязательна' : null),
      deadline: (value) => (!value ? 'Забыла дэдлайн :)' : null),
    },
  });

  const companiesSelectData = useMemo(
    () =>
      companies.map((company) => ({
        value: company.id,
        label: company.name,
      })),
    [companies]
  );

  const handleSubmit = async (values: VacancyFormValues) => {
    const dto: CreateVacancyDto = {
      title: values.title,
      description: values.description || undefined,
      deadline: values.deadline ? String(values.deadline) : undefined,
      companyId: values.companyId,
    };
    const createdVacancyResponse = await createVacancy({ data: dto });
    const vacancyId = createdVacancyResponse.data?.id;
    if (values?.recruiterIds?.length > 0) {
      await Promise.allSettled(
        values?.recruiterIds.map((recruiterId) =>
          assignRecruiter({
            data: {
              vacancyId,
              recruiterId,
              requiredResumes: values?.requiredResumes,
            },
          })
        )
      );
      form.reset();
      onClose();
      return;
    }
    form.reset();
    onClose();
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const renderRecruiterOption: MultiSelectProps['renderOption'] = ({ option, checked }) => (
    <Group justify="space-between" wrap="nowrap">
      <Group wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        <Avatar size={36} radius="xl" />
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

  const isFetching = isCompanyFetching || isRecruiterFetching;
  const isPending = isVacancyAssigning || isVacancyCreating;

  return (
    <Drawer
      opened={opened}
      onClose={handleCancel}
      title="Создание вакансии"
      padding={isMobile ? 'lg' : 'md'}
      closeButtonProps={{
        size: 'lg',
      }}
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
      {isFetching ? (
        <Loader color="violet" />
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Название вакансии"
              placeholder="Senior Frontend Developer"
              required
              {...form.getInputProps('title')}
            />

            <Textarea
              label="Описание"
              placeholder="Краткое описание вакансии"
              minRows={3}
              {...form.getInputProps('description')}
            />

            <Select
              label="Компания"
              placeholder="Выберите компанию"
              data={companiesSelectData}
              required
              searchable
              comboboxProps={
                isMobile ? { withinPortal: false, position: 'top', zIndex: 301 } : undefined
              }
              {...form.getInputProps('companyId')}
            />

            <MultiSelect
              label="Назначить рекрутеров"
              placeholder="Введи или выбери"
              data={recruiters?.map((recruiter) => ({
                label: prepareRecruitersFullName(recruiter),
                value: recruiter?.id,
              }))}
              limit={5}
              nothingFoundMessage="Не нашли..."
              renderOption={renderRecruiterOption}
              searchable
              hidePickedOptions
              comboboxProps={
                isMobile ? { withinPortal: false, position: 'top', zIndex: 301 } : undefined
              }
              {...form.getInputProps('recruiterIds')}
            />

            <NumberInput
              label="Базовое количество CV"
              placeholder="от 0 до ∞"
              min={0}
              {...form.getInputProps('requiredResumes')}
            />

            <DateInput
              label="Дедлайн"
              placeholder="Выберите дату"
              clearable
              minDate={new Date()}
              {...form.getInputProps('deadline')}
            />

            <Group justify="flex-end" mt="xl">
              <Button variant="outline" onClick={handleCancel} disabled={isPending}>
                Отмена
              </Button>
              <Button type="submit" loading={isPending}>
                Создать
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Drawer>
  );
};
