import React from 'react';
import { routes } from './routes';
import { useRoutes } from 'react-router';

import '@radix-ui/themes/styles.css';
import './App.scss';

const App: React.FC = () => {
  return useRoutes(routes);
};

export default App;
