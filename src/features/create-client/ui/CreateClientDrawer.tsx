import { IconAt } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { IMaskInput } from 'react-imask';
import { Button, Drawer, Group, Input, Stack, TextInput, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  getCompanyControllerFindAllQueryKey,
  useCompanyControllerCreate,
} from '../../../shared/api/generated/endpoints';
import type { CreateCompanyDto } from '../../../shared/types';

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
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
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

  const handleSubmit = (values: ClientFormValues) => {
    const dto: CreateCompanyDto = {
      name: values.name,
      address: values.address,
      email: values.email,
      phone: values.phone,
    };
    createClient({ data: dto });
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleCancel}
      title="Создание клиента"
      padding="md"
      closeButtonProps={{
        size: 'lg',
      }}
      position={isMobile ? 'bottom' : 'right'}
      size={isMobile ? 'auto' : 'md'}
      transitionProps={{
        transition: isMobile ? 'slide-up' : 'slide-left',
        duration: 200,
        timingFunction: 'ease',
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
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

          <Input.Wrapper label="Телефон компании">
            <Input
              component={IMaskInput}
              mask="+7 (000) 000-00-00"
              placeholder="+7 (999) 123-45-67"
              {...form.getInputProps('phone')}
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
    </Drawer>
  );
};
