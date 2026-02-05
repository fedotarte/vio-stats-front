import type { KeyboardEvent } from 'react';
import {
  Box,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface AuthScreenProps {
  username: string;
  password: string;
  error: string | null;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
}

export const AuthScreen = ({
  username,
  password,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onKeyDown,
}: AuthScreenProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const safeTop = 'env(safe-area-inset-top, 0px)';
  const safeBottom = 'env(safe-area-inset-bottom, 0px)';

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `calc(${theme.spacing.xl}px + ${safeTop}) ${theme.spacing.md}px calc(${theme.spacing.xl}px + ${safeBottom})`,
      }}
    >
      <Paper
        withBorder
        shadow="sm"
        radius="md"
        p={isMobile ? 'md' : 'lg'}
        style={{ width: '100%', maxWidth: 380 }}
      >
        <Stack gap="md">
          <Title order={3}>Авторизация</Title>
          <Text size="sm" c="dimmed">
            Введи логин и пароль
          </Text>

          <TextInput
            label="Логин"
            placeholder="Введите логин"
            value={username}
            onChange={(e) => onUsernameChange(e.currentTarget.value)}
            onKeyDown={onKeyDown}
            autoFocus={!isMobile}
          />

          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => onPasswordChange(e.currentTarget.value)}
            onKeyDown={onKeyDown}
          />

          {error && (
            <Text size="sm" c="red">
              {error}
            </Text>
          )}

          <Button onClick={onSubmit} fullWidth mt="md">
            Войти
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
