import React from 'react';
import { Theme, Container, Tabs, Box } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './App.css';
import UsersTab from './components/Users/UsersTab';
import RolesTab from './components/Roles/RolesTab';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastProvider } from './context/ToastContext';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Theme >
          <Container size="3" className="App">
            <Box py="5">
              <Tabs.Root defaultValue="users">
                <Tabs.List>
                  <Tabs.Trigger value="users">Users</Tabs.Trigger>
                  <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
                </Tabs.List>
                <Box pt="4">
                  <Tabs.Content value="users">
                    <UsersTab />
                  </Tabs.Content>
                  <Tabs.Content value="roles">
                    <RolesTab />
                  </Tabs.Content>
                </Box>
              </Tabs.Root>
            </Box>
          </Container>
        </Theme>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
