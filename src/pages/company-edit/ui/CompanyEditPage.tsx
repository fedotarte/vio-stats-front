import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IconArrowLeft, IconTrash } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  getCompanyControllerFindAllQueryKey,
  useCompanyControllerDelete,
  useCompanyControllerFindById,
  useCompanyControllerUpdate,
} from '../../../shared/api/generated/endpoints';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { ROUTES } from '../../../shared/config/routes';
import type { UpdateCompanyDto } from '../../../shared/api/generated/models';
import { CenteredLoader } from '../../../shared/ui/CenteredState';
import { MobileBackBar } from '../../../shared/ui/MobileBackBar';

const CompanyEditPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { data: companyResponse, isLoading } = useCompanyControllerFindById(companyId ?? '', {
    query: { enabled: !!companyId },
  });
  const company = companyResponse?.status === 200 ? companyResponse.data : null;

  const { mutate: updateCompany, isPending: isUpdating } = useCompanyControllerUpdate({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Успешно',
          message: 'Компания обновлена',
          color: 'green',
        });
        navigate(ROUTES.clients.root);
        queryClient.invalidateQueries({ queryKey: getCompanyControllerFindAllQueryKey() });
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось обновить компанию',
          color: 'red',
        });
      },
    },
  });

  const { mutate: deleteCompany, isPending: isDeleting } = useCompanyControllerDelete({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Успешно',
          message: 'Компания удалена',
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getCompanyControllerFindAllQueryKey() });
        navigate(ROUTES.clients.root);
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось удалить компанию',
          color: 'red',
        });
      },
    },
  });

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    validate: {
      name: (value) => (!value ? 'Название обязательно' : null),
    },
  });

  useEffect(() => {
    if (company) {
      form.setValues({
        name: company.name,
        email: company.email ?? '',
        phone: company.phone ?? '',
        address: company.address ?? '',
      });
    }
  }, [company]);

  const handleSubmit = (values: UpdateCompanyDto) => {
    if (!companyId) return;
    updateCompany({ id: companyId, data: values });
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Удалить компанию?',
      centered: true,
      children: <Text size="sm">Вы точно хотите удалить компанию? Это действие нельзя отменить.</Text>,
      labels: { confirm: 'Удалить компанию', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => companyId && deleteCompany({ id: companyId }),
    });

  const isPending = isUpdating || isDeleting;

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <CenteredLoader />
      </Container>
    );
  }

  if (!company) {
    return (
      <Container size="md" py="xl">
        <Text>Компания не найдена</Text>
        <Button
          leftSection={<IconArrowLeft size={16} />}
          variant="subtle"
          mt="md"
          onClick={() => navigate(ROUTES.clients.root)}
        >
          Назад к списку компаний
        </Button>
        {isMobile && <MobileBackBar to={ROUTES.clients.root} label="Назад" fixed />}
      </Container>
    );
  }

  return (
    <>
      <Container size="md" py="xl">
        {!isMobile && (
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="subtle"
            mb="md"
            onClick={() => navigate(ROUTES.clients.root)}
          >
            Назад к списку компаний
          </Button>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Название компании"
              placeholder="Введите название"
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              placeholder="company@example.com"
              type="email"
              {...form.getInputProps('email')}
            />
            <TextInput
              label="Телефон"
              placeholder="+7 (999) 123-45-67"
              {...form.getInputProps('phone')}
            />
            <TextInput
              label="Адрес"
              placeholder="Введите адрес"
              {...form.getInputProps('address')}
            />

            <Button type="submit" loading={isUpdating} disabled={isPending}>
              Сохранить
            </Button>

            <Button
              color="red"
              variant="outline"
              leftSection={<IconTrash size={16} />}
              onClick={openDeleteModal}
              loading={isDeleting}
              disabled={isPending}
            >
              Удалить компанию
            </Button>
          </Stack>
        </form>
      </Container>

      {isMobile && <MobileBackBar to={ROUTES.clients.root} label="Назад" fixed />}
    </>
  );
};

export default CompanyEditPage;
