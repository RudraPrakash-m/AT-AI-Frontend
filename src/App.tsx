import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeContextProvider } from '@/theme/ThemeContext';
import { AuthProvider } from '@/features/authentication/hooks/useAuth';
import { AppRoutes } from '@/routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeContextProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;