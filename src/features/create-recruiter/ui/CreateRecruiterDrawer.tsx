import { useQueryClient } from '@tanstack/react-query';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  getRecruiterControllerFindAllQueryKey,
  useRecruiterControllerCreate,
} from '../../../shared/api/generated/endpoints';
import type { CreateRecruiterDto } from '../../../shared/types';
import { ResponsiveDrawer } from '../../../shared/ui/ResponsiveDrawer';

interface CreateRecruiterDrawerProps {
  opened: boolean;
  onClose: () => void;
}

interface RecruiterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const CreateRecruiterDrawer = ({ opened, onClose }: CreateRecruiterDrawerProps) => {
  const queryClient = useQueryClient();

  const { mutate: createRecruiter, isPending } = useRecruiterControllerCreate({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Успешно',
          message: 'Рекрутер создан',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getRecruiterControllerFindAllQueryKey() });
        form.reset();
        onClose();
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось создать рекрутера',
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

  const handleSubmit = (values: RecruiterFormValues) => {
    const dto: CreateRecruiterDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone || undefined,
    };
    createRecruiter({ data: dto });
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <ResponsiveDrawer
      opened={opened}
      onClose={handleCancel}
      title="Создание рекрутера"
      mobileSize="100%"
      desktopSize="md"
      desktopPadding="md"
    >
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
            <Button type="submit" loading={isPending}>
              Создать
            </Button>
          </Group>
        </Stack>
      </form>
    </ResponsiveDrawer>
  );
};
