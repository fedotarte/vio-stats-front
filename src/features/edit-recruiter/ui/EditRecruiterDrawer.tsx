import { useEffect } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Drawer,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  getRecruiterControllerFindAllQueryKey,
  getRecruiterControllerFindByIdQueryKey,
  useRecruiterControllerDelete,
  useRecruiterControllerFindById,
  useRecruiterControllerUpdate,
} from '../../../shared/api/generated/endpoints';
import { ROUTES } from '../../../shared/config/routes';
import type { UpdateRecruiterDto } from '../../../shared/types';

interface EditRecruiterDrawerProps {
  recruiterId: string | null;
  opened: boolean;
  onClose: () => void;
}

interface RecruiterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const EditRecruiterDrawer = ({ recruiterId, opened, onClose }: EditRecruiterDrawerProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: recruiterData, isLoading } = useRecruiterControllerFindById(recruiterId ?? '', {
    query: { enabled: !!recruiterId && opened },
  });
  const recruiter = recruiterData?.status === 200 ? recruiterData.data : null;

  const { mutate: updateRecruiter, isPending: isUpdating } = useRecruiterControllerUpdate({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Успешно',
          message: 'Рекрутер обновлён',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getRecruiterControllerFindAllQueryKey() });
        if (recruiterId) {
          queryClient.invalidateQueries({
            queryKey: getRecruiterControllerFindByIdQueryKey(recruiterId),
          });
        }
        onClose();
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось обновить рекрутера',
          color: 'red',
        });
      },
    },
  });

  const { mutate: deleteRecruiter, isPending: isDeleting } = useRecruiterControllerDelete({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Успешно',
          message: 'Рекрутер удалён',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getRecruiterControllerFindAllQueryKey() });
        onClose();
        navigate(ROUTES.recruiters.root);
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось удалить рекрутера',
          color: 'red',
        });
      },
    },
  });

  const form = useForm<RecruiterFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    validate: {
      firstName: (value) => (!value ? 'Имя обязательно' : null),
      lastName: (value) => (!value ? 'Фамилия обязательна' : null),
      email: (value) =>
        !value ? 'Email обязателен' : !/^\S+@\S+$/.test(value) ? 'Некорректный email' : null,
    },
  });

  useEffect(() => {
    if (recruiter) {
      form.setValues({
        firstName: recruiter.firstName,
        lastName: recruiter.lastName,
        email: recruiter.email,
        phone: recruiter.phone ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruiter]);

  const handleSubmit = (values: RecruiterFormValues) => {
    if (!recruiterId) return;

    const dto: UpdateRecruiterDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone || undefined,
    };
    updateRecruiter({ id: recruiterId, data: dto });
  };

  const openDeleteModal = () => {
    console.info('inside callback');
    return modals.openConfirmModal({
      title: 'Удалить рекрутера?',
      centered: true,
      children: <Text size="sm">Вы точно хотите удалить рекрутера? Это действие необратимо.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (recruiterId) {
          deleteRecruiter({ id: recruiterId });
        }
      },
    });
  };

  const handleCancel = () => {
    if (recruiter) {
      form.setValues({
        firstName: recruiter.firstName,
        lastName: recruiter.lastName,
        email: recruiter.email,
        phone: recruiter.phone ?? '',
      });
    }
    onClose();
  };

  const isPending = isUpdating || isDeleting;

  return (
    <Drawer
      opened={opened}
      onClose={handleCancel}
      title="Редактирование рекрутера"
      padding="md"
      closeButtonProps={{
        size: 'lg',
      }}
      position={isMobile ? 'bottom' : 'right'}
      size={isMobile ? '100%' : 'md'}
      transitionProps={{
        transition: isMobile ? 'slide-up' : 'slide-left',
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
      {isLoading ? (
        <Loader color="violet" />
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Имя"
              placeholder="Введите имя"
              required
              {...form.getInputProps('firstName')}
            />

            <TextInput
              label="Фамилия"
              placeholder="Введите фамилию"
              required
              {...form.getInputProps('lastName')}
            />

            <TextInput
              label="Email"
              placeholder="example@company.com"
              type="email"
              required
              {...form.getInputProps('email')}
            />

            <TextInput
              label="Телефон"
              placeholder="+7 (999) 123-45-67"
              {...form.getInputProps('phone')}
            />

            <Group justify="flex-end" mt="xl">
              <Button variant="outline" onClick={handleCancel} disabled={isPending}>
                Отмена
              </Button>
              <Button type="submit" loading={isUpdating}>
                Сохранить
              </Button>
            </Group>

            <Button
              onClick={openDeleteModal}
              color="red"
              leftSection={<IconTrash size={16} />}
              variant="outline"
              fullWidth
              loading={isDeleting}
            >
              Удалить рекрутера
            </Button>
          </Stack>
        </form>
      )}
    </Drawer>
  );
};
