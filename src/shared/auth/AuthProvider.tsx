import { useCallback, useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { HttpStatusCode, type AxiosError } from 'axios';
import { Button, Modal, PasswordInput, Stack, Text, TextInput, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { AXIOS_INSTANCE } from '../api/axios-instance';
import { AuthContext } from './AuthContext';

const AUTH_STORAGE_KEY = 'vio_stats_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetViewportZoom = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement | null;
    activeElement?.blur();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) return;
    const previousContent = metaViewport.getAttribute('content');
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
    if (previousContent) {
      window.setTimeout(() => {
        metaViewport.setAttribute('content', previousContent);
      }, 0);
    }
  }, []);

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      AXIOS_INSTANCE.defaults.headers.common['Authorization'] = `Basic ${savedAuth}`;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
    }
  }, []);

  // Setup 401 interceptor
  useEffect(() => {
    const interceptorId = AXIOS_INSTANCE.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          // Clear saved auth on 401
          localStorage.removeItem(AUTH_STORAGE_KEY);
          delete AXIOS_INSTANCE.defaults.headers.common['Authorization'];
          setIsAuthenticated(false);
          setIsModalOpen(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      AXIOS_INSTANCE.interceptors.response.eject(interceptorId);
    };
  }, []);

  const openAuthModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    delete AXIOS_INSTANCE.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!username || !password) {
      setError('Введите логин и пароль');
      return;
    }

    const credentials = btoa(`${username}:${password}`);
    AXIOS_INSTANCE.defaults.headers.common['Authorization'] = `Basic ${credentials}`;
    localStorage.setItem(AUTH_STORAGE_KEY, credentials);

    setIsAuthenticated(true);
    setIsModalOpen(false);
    setError(null);
    setUsername('');
    setPassword('');

    resetViewportZoom();
    window.location.reload();
  }, [username, password, resetViewportZoom]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, openAuthModal, logout }}>
      {children}
      <Modal
        opened={isModalOpen}
        onClose={() => {}}
        title="Притормози!"
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        centered
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Введи логин и пароль
          </Text>

          <TextInput
            label="Логин"
            placeholder="Введите логин"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            autoFocus={!isMobile}
          />

          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
          />

          {error && (
            <Text size="sm" c="red">
              {error}
            </Text>
          )}

          <Button onClick={handleSubmit} fullWidth mt="md">
            Войти
          </Button>
        </Stack>
      </Modal>
    </AuthContext.Provider>
  );
}
