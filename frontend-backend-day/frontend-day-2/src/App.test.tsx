import { render, screen } from '@testing-library/react';
import UserList from './UserList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

test('renders loading state', () => {
  renderWithClient(<UserList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
