// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App.tsx';

import { Theme } from '@radix-ui/themes';
import './index.scss';
import 'virtual:uno.css';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Theme hasBackground={false}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Theme>,
  // </StrictMode>,
);
