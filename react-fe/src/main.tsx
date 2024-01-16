import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import { setupStore } from './app/store';
import { customTheme } from './styles';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ReduxProvider store={setupStore()}>
      <ChakraProvider theme={customTheme}>
        <CSSReset />
        <App />
      </ChakraProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
