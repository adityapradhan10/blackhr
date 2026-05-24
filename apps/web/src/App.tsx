import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './shared/layouts/AppLayout';
import { QueryProvider } from './shared/providers/QueryProvider';

export function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </QueryProvider>
  );
}
