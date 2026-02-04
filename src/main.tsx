import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

import App from './app/App.tsx';
import { Providers } from './app/providers/providers.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
