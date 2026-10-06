import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuraProviders } from '@/providers/AuraProviders';
import '@/sdk/init';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuraProviders>
      <App />
    </AuraProviders>
  </StrictMode>,
);

