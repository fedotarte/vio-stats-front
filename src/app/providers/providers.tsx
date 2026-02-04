import type { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '../../shared/auth';
import { queryClient } from '../queries';
import { theme } from '../themes';

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <AuthProvider>{children}</AuthProvider>
      </ModalsProvider>
    </MantineProvider>
  </QueryClientProvider>
);
