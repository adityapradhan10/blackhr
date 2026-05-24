import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { QueryProvider } from './shared/providers/QueryProvider';

export function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryProvider>
  );
}
