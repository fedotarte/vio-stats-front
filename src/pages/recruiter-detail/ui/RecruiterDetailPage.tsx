import { useMemo, useState } from 'react';
import { IconArrowLeft, IconPencil } from '@tabler/icons-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Group,
  Loader,
  Paper,
  RingProgress,
  Select,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme,
  type DefaultMantineColor,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { CompanySelect } from '../../../entities/company';
import { RecruiterVacanciesList } from '../../../entities/vacancy';
import { AssignmentDrawer } from '../../../features/edit-assignment';
import { EditRecruiterDrawer } from '../../../features/edit-recruiter';
import {
  useAssignmentControllerFindAll,
  useCompanyControllerFindAll,
  useRecruiterControllerFindById,
} from '../../../shared/api/generated/endpoints';
import type { AssignedVacancyRecruiterDto } from '../../../shared/api/generated/models';
import { ROUTES } from '../../../shared/config/routes';
import { MobileBackBar } from '../../../shared/ui/MobileBackBar';
import type { VacancyEntity } from '../../../shared/types';

const RecruiterDetailPage = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { recruiterId, assignmentId } = useParams<{ recruiterId: string; assignmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>('0');

  // Проверяем, открыт ли режим редактирования через URL
  const isEditMode = location.pathname.endsWith('/edit');
  const { data: recruiterData, isLoading: recruiterLoading } = useRecruiterControllerFindById(
    recruiterId ?? ''
  );
  const { data: recruiterVacanciesData, isLoading: vacanciesLoading } =
    useAssignmentControllerFindAll({ recruiterId: recruiterId });
  const { data: companiesData, isLoading: companiesLoading } = useCompanyControllerFindAll();

  const recruiter = recruiterData?.status === 200 ? recruiterData.data : null;

  const recruiterVacancies: AssignedVacancyRecruiterDto[] | undefined =
    recruiterVacanciesData?.data;

  const selectedAssignment = useMemo(
    () => recruiterVacancies?.find((assignment) => assignment.id === assignmentId) ?? null,
    [assignmentId, recruiterVacancies]
  );
  const drawerOpened = Boolean(assignmentId);

  const allCompanies = companiesData?.data;

  // Get unique company IDs from recruiter's vacancies
  const recruiterCompanyIds = useMemo(() => {
    const ids = new Set(
      recruiterVacancies
        ?.map((rv) => {
          const vacancy = rv.vacancy as unknown as VacancyEntity;
          return vacancy?.companyId;
        })
        .filter(Boolean)
    );
    return Array.from(ids) as string[];
  }, [recruiterVacancies]);

  // Filter companies that the recruiter works with
  const recruiterCompanies = useMemo(
    () => allCompanies?.filter((c) => recruiterCompanyIds.includes(c.id)),
    [allCompanies, recruiterCompanyIds]
  );

  const getProgressColor = (value: number): DefaultMantineColor => {
    if (value < 30) return 'red';
    if (value < 70) return 'yellow';
    return 'green';
  };

  // Calculate overall statistics (same formulas as on RecruiterVacancyCard)
  const stats = useMemo(() => {
    const totalRequired = recruiterVacancies?.reduce((sum, rv) => sum + rv.requiredResumes, 0) ?? 0;
    const totalSent = recruiterVacancies?.reduce((sum, rv) => sum + rv.sentResumes, 0) ?? 0;
    const totalAccepted = recruiterVacancies?.reduce((sum, rv) => sum + rv.acceptedResumes, 0) ?? 0;
    const remainingResumes = totalRequired - totalSent;
    const activeVacanciesCount = recruiterVacancies?.length ?? 0;

    const efficiencyPercent =
      totalRequired <= 0 ? 0 : Math.min(100, Math.round((totalSent / totalRequired) * 100));
    const relevancePercent =
      totalSent <= 0 ? 0 : Math.min(100, Math.round((totalAccepted / totalSent) * 100));

    return {
      activeVacancies: activeVacanciesCount,
      remainingResumes: Math.max(0, remainingResumes),
      totalRequired,
      totalSent,
      totalAccepted,
      efficiencyPercent,
      relevancePercent,
    };
  }, [recruiterVacancies]);

  // Get recruiter vacancies filtered by selected company
  const filteredRecruiterVacancies = useMemo(() => {
    if (!selectedCompanyId) return [];
    return recruiterVacancies?.filter((rv) => {
      const vacancy = rv.vacancy as unknown as VacancyEntity;
      return vacancy && (selectedCompanyId === '0' || vacancy.companyId === selectedCompanyId);
    });
  }, [selectedCompanyId, recruiterVacancies]);

  const handleVacancyClick = (recruiterVacancy: AssignedVacancyRecruiterDto) => {
    navigate(ROUTES.recruiters.assignment(recruiterId, recruiterVacancy.id));
  };

  const isLoading = recruiterLoading || vacanciesLoading || companiesLoading;

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Center h={200}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (!recruiter) {
    return (
      <>
        <Container size="md" py="xl">
          <Text>Рекрутер не найден</Text>
          {!isMobile && (
            <Button
              onClick={() => navigate(ROUTES.recruiters.root)}
              leftSection={<IconArrowLeft size={16} />}
              mt="md"
            >
              Назад к списку рекрутеров
            </Button>
          )}
        </Container>
        {isMobile && <MobileBackBar to={ROUTES.recruiters.root} label="Назад" fixed />}
      </>
    );
  }

  const fullName = `${recruiter.firstName} ${recruiter.lastName}`;

  const vacanciesSection = (
    <>
      {selectedCompanyId && (filteredRecruiterVacancies ?? []).length > 0 && (
        <>
          <Title order={3} mb="md">
            Вакансии
          </Title>
          <RecruiterVacanciesList
            recruiterVacancies={filteredRecruiterVacancies ?? []}
            onVacancyClick={handleVacancyClick}
          />
        </>
      )}
      {selectedCompanyId && (filteredRecruiterVacancies ?? [])?.length === 0 && (
        <Text c="dimmed" ta="center">
          Нет доступных вакансий для выбранной компании
        </Text>
      )}
    </>
  );

  return (
    <>
      <Box
        style={
          isMobile
            ? {
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }
            : undefined
        }
      >
        {/* Верхняя часть: нав + стики-плашка + селект — на мобиле не скроллится */}
        <Box style={isMobile ? { flexShrink: 0 } : undefined}>
          <Container size="md" py={isMobile ? 'sm' : 'xl'}>
            {!isMobile && (
              <Button
                onClick={() => navigate(ROUTES.recruiters.root)}
                leftSection={<IconArrowLeft size={16} />}
                variant="subtle"
                mb="md"
              >
                Назад к списку рекрутеров
              </Button>
            )}

            <Paper
              shadow="sm"
              p={isMobile ? 'sm' : 'lg'}
              withBorder
              mb={isMobile ? 'sm' : 'xl'}
              style={
                isMobile
                  ? {
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      backgroundColor: 'var(--mantine-color-body)',
                    }
                  : undefined
              }
            >
              <Stack gap={isMobile ? 'xs' : 'md'}>
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Stack gap={4} style={{ minWidth: 0 }}>
                    <Title order={isMobile ? 2 : 1}>{fullName}</Title>
                    <Text c="dimmed" size={isMobile ? 'xs' : 'sm'}>
                      {recruiter.email}
                    </Text>
                    {recruiter.phone && (
                      <Text c="dimmed" size={isMobile ? 'xs' : 'sm'}>
                        {recruiter.phone}
                      </Text>
                    )}
                  </Stack>
                  <ActionIcon
                    variant="subtle"
                    color="violet"
                    size="xl"
                    onClick={() => navigate(ROUTES.recruiters.edit(recruiterId ?? ''))}
                    aria-label="Редактировать рекрутера"
                  >
                    <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Group>

                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  gap={{ base: 'xs', sm: 'xl' }}
                  mt={isMobile ? 'xs' : 'md'}
                  align={{ base: 'stretch', sm: 'center' }}
                  justify={{ base: 'center', sm: 'start' }}
                >
                  <Flex
                    justify={{ base: 'space-between', sm: 'flex-start' }}
                    align="center"
                    gap="sm"
                  >
                    <Text size="sm" c="dimmed">
                      Вакансий в работе:
                    </Text>
                    <Text size="sm" fw={700}>
                      {stats.activeVacancies}
                    </Text>
                  </Flex>
                  <Flex
                    justify={{ base: 'space-between', sm: 'flex-start' }}
                    align="center"
                    gap="sm"
                    style={{ flex: 1 }}
                  >
                    <Text size="sm" c="dimmed">
                      Осталось отправить резюме:
                    </Text>
                    <Text size="sm" fw={700} c={stats.remainingResumes > 0 ? 'orange' : 'green'}>
                      {stats.remainingResumes}
                    </Text>
                  </Flex>
                </Flex>

                <Group
                  gap={isMobile ? 'sm' : 'lg'}
                  mt={isMobile ? 'xs' : 'md'}
                  justify="space-between"
                >
                  <Stack gap={4} align="center">
                    <RingProgress
                      size={isMobile ? 72 : 100}
                      thickness={isMobile ? 8 : 10}
                      sections={[
                        {
                          value: stats.efficiencyPercent,
                          color: getProgressColor(stats.efficiencyPercent),
                        },
                      ]}
                      label={
                        <Text fw={700} size={isMobile ? 'xs' : 'sm'} ta="center">
                          {stats.efficiencyPercent}%
                        </Text>
                      }
                    />
                    <Text size="xs" fw={500}>
                      Общая эффективность
                    </Text>
                    <Text size="xs" c="dimmed">
                      {stats.totalSent} / {stats.totalRequired}
                    </Text>
                  </Stack>
                  <Stack gap={4} align="center">
                    <RingProgress
                      size={isMobile ? 72 : 100}
                      thickness={isMobile ? 8 : 10}
                      sections={[
                        {
                          value: stats.relevancePercent,
                          color: getProgressColor(stats.relevancePercent),
                        },
                      ]}
                      label={
                        <Text fw={700} size={isMobile ? 'xs' : 'sm'} ta="center">
                          {stats.relevancePercent}%
                        </Text>
                      }
                    />
                    <Text size="xs" fw={500}>
                      Общая релевантность
                    </Text>
                    <Text size="xs" c="dimmed">
                      {stats.totalAccepted} / {stats.totalSent}
                    </Text>
                  </Stack>
                </Group>
              </Stack>
            </Paper>

            <Space h={isMobile ? 'sm' : 'xl'} />
            <CompanySelect
              companies={recruiterCompanies ?? []}
              value={selectedCompanyId}
              onChange={(v) => setSelectedCompanyId(v ?? '0')}
            />

            {!isMobile && (
              <>
                <Space h="xl" />
                <Group>
                  <Button>Выгрузить сводку</Button>
                  <Select
                    placeholder="В разрезе:"
                    data={[
                      { label: 'За месяц', value: 'За месяц' },
                      { label: 'За неделю', value: 'За неделю' },
                    ]}
                  />
                </Group>
              </>
            )}

            <Space h={isMobile ? 'sm' : 'xl'} />

            {/* На десктопе список вакансий здесь */}
            {!isMobile && vacanciesSection}
          </Container>
        </Box>

        {/* На мобиле: единственная область прокрутки = список вакансий (высота = 100dvh минус верхний блок) */}
        {isMobile && (
          <Box style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <Container size="md" py="sm">
              {vacanciesSection}
            </Container>
          </Box>
        )}

        {isMobile && (
          <MobileBackBar to={ROUTES.recruiters.root} label="Назад" />
        )}
      </Box>

      <AssignmentDrawer
        assignmentId={assignmentId ?? null}
        assignment={selectedAssignment}
        opened={drawerOpened}
        onCloseAssignmentDrawer={() => {
          navigate(ROUTES.recruiters.detail(recruiter.id));
        }}
      />

      <EditRecruiterDrawer
        recruiterId={recruiter.id}
        opened={isEditMode}
        onClose={() => navigate(ROUTES.recruiters.detail(recruiter.id))}
      />
    </>
  );
};

export default RecruiterDetailPage;
