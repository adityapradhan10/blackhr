import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

export function renderApp(rootElement: HTMLElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

renderApp(rootElement);
