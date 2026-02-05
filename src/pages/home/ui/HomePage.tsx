import { useCallback } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import { ActionIcon, Affix, Container, Tabs, Transition } from '@mantine/core';
import { ROUTES } from '../../../shared/config/routes';

const TAB_PATHS = {
  recruiters: ROUTES.recruiters.root,
  vacancies: ROUTES.vacancies.root,
  clients: ROUTES.clients.root,
} as const;

const TAB_CREATE_PATHS = {
  recruiters: ROUTES.recruiters.create,
  vacancies: ROUTES.vacancies.create,
  clients: ROUTES.clients.create,
} as const;

type TabRoute = keyof typeof TAB_PATHS;

const isTabInRoutes = (tab: string | null): tab is TabRoute => tab !== null && tab in TAB_PATHS;

const HomePage = () => {
  const navigate = useNavigate();

  const recruitersMatch = useMatch({ path: ROUTES.recruiters.root, end: false });
  const vacanciesMatch = useMatch({ path: ROUTES.vacancies.root, end: false });
  const clientsMatch = useMatch({ path: ROUTES.clients.root, end: false });

  const activeTab: TabRoute = recruitersMatch
    ? 'recruiters'
    : vacanciesMatch
      ? 'vacancies'
      : clientsMatch
        ? 'clients'
        : 'recruiters';

  const handleTabChange = useCallback(
    (tab: string | null) => {
      if (isTabInRoutes(tab)) {
        navigate(TAB_PATHS[tab]);
      }
    },
    [navigate]
  );

  const handleFabClick = useCallback(() => {
    navigate(TAB_CREATE_PATHS[activeTab]);
  }, [navigate, activeTab]);

  return (
    <Container size="md" py="xl">
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="recruiters">Рекрутеры</Tabs.Tab>
          <Tabs.Tab value="vacancies">Вакансии</Tabs.Tab>
          <Tabs.Tab value="clients">Клиенты</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Outlet />

      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted>
          {(transitionStyles) => (
            <ActionIcon
              size={60}
              radius="xl"
              variant="filled"
              color="myColor"
              style={transitionStyles}
              onClick={handleFabClick}
            >
              <IconPlus size={28} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
    </Container>
  );
};

export default HomePage;
