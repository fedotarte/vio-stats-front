import { IconAt } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { IMaskInput } from 'react-imask';
import { Button, Group, Input, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  getCompanyControllerFindAllQueryKey,
  useCompanyControllerCreate,
} from '../../../shared/api/generated/endpoints';
import type { CreateCompanyDto } from '../../../shared/types';
import { ResponsiveDrawer } from '../../../shared/ui/ResponsiveDrawer';

interface CreateClientDrawerProps {
  opened: boolean;
  onClose: () => void;
}

interface ClientFormValues {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const CreateClientDrawer = ({ opened, onClose }: CreateClientDrawerProps) => {
  const icon = <IconAt size={16} />;
  const queryClient = useQueryClient();

  const { mutate: createClient, isPending } = useCompanyControllerCreate({
    mutation: {
      onSuccess: async () => {
        notifications.show({
          title: 'Успешно',
          message: 'Компания-клиент создана',
          color: 'green',
        });
        await queryClient.invalidateQueries({ queryKey: getCompanyControllerFindAllQueryKey() });
        form.reset();
        onClose();
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось создать компанию',
          color: 'red',
        });
      },
    },
  });

  const form = useForm<ClientFormValues>({
    initialValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
    validate: {
      name: (value) => (!value ? 'Название компании обязательно' : null),
    },
  });

  const normalizeOptional = (value?: string) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  };

  const normalizePhone = (value?: string) => {
    const digits = value?.replace(/\D/g, '') ?? '';
    return digits.length >= 11 ? value : undefined;
  };

  const handleSubmit = (values: ClientFormValues) => {
    const dto: CreateCompanyDto = {
      name: values.name,
      address: normalizeOptional(values.address),
      email: normalizeOptional(values.email),
      phone: normalizePhone(values.phone),
    };
    createClient({ data: dto });
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <ResponsiveDrawer
      opened={opened}
      onClose={handleCancel}
      title="Создание клиента"
      mobileSize="auto"
      desktopSize="md"
      mobilePadding="md"
      desktopPadding="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Название компании-клиента"
            placeholder="ООО Рога и копыта"
            required
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Адрес компании"
            placeholder="Ул Пушкина, дом Колотушкина"
            {...form.getInputProps('address')}
          />

          <TextInput
            rightSectionPointerEvents="none"
            rightSection={icon}
            label="Email компании"
            placeholder="info@company.ru"
            {...form.getInputProps('email')}
          />

          <Input.Wrapper label="Телефон компании" error={form.getInputProps('phone').error}>
            <Input
              component={IMaskInput}
              mask="+7 (000) 000-00-00"
              placeholder="+7 (999) 123-45-67"
              value={form.values.phone}
              onAccept={(value) => form.setFieldValue('phone', value)}
              onBlur={form.getInputProps('phone').onBlur}
            />
          </Input.Wrapper>

          <Group justify="flex-end" mt="md">
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
