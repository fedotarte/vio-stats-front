import { useCallback, useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { HttpStatusCode, type AxiosError } from 'axios';
import { Center, Loader } from '@mantine/core';
import { AXIOS_INSTANCE } from '../api/axios-instance';
import { AuthContext } from './AuthContext';
import { AuthScreen } from './ui/AuthScreen';

const AUTH_STORAGE_KEY = 'vio_stats_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
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
    } else {
      setIsAuthenticated(false);
    }
    setIsReady(true);
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
        }
        return Promise.reject(error);
      }
    );

    return () => {
      AXIOS_INSTANCE.interceptors.response.eject(interceptorId);
    };
  }, []);

  const openAuthModal = useCallback(() => {
    setIsAuthenticated(false);
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

  if (!isReady) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, openAuthModal, logout }}>
      {isAuthenticated ? (
        children
      ) : (
        <AuthScreen
          username={username}
          password={password}
          error={error}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      )}
    </AuthContext.Provider>
  );
}
