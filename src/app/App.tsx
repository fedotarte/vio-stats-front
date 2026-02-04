import { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { appRoutes } from './router/routes';

const AppRoutes = () => useRoutes(appRoutes);

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <Center h="100vh">
            <Loader size="lg" />
          </Center>
        }
      >
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
