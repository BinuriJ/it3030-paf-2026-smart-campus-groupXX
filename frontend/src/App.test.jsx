import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as resourceApi from './api/resourceApi';

vi.mock('./api/resourceApi', () => ({
  fetchResources: vi.fn(),
  createResource: vi.fn(),
  updateResource: vi.fn(),
  deleteResource: vi.fn(),
}));

it('renders the Smart Campus title', () => {
  resourceApi.fetchResources.mockResolvedValue([]);
  render(<App />);
  expect(screen.getByText(/Smart Campus Facilities Catalogue/i)).toBeInTheDocument();
});

it('shows summary counts from loaded resources', async () => {
  resourceApi.fetchResources.mockResolvedValue([
    { id: 1, name: 'Hall A', type: 'Lecture Hall', capacity: 100, location: 'Block A', availabilityWindow: '08:00-18:00', status: 'ACTIVE' },
    { id: 2, name: 'Projector B', type: 'Equipment', capacity: 1, location: 'Store', availabilityWindow: '09:00-15:00', status: 'OUT_OF_SERVICE' },
  ]);

  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId('resources-listed')).toHaveTextContent('2');
    expect(screen.getByTestId('active-resources')).toHaveTextContent('1');
    expect(screen.getByTestId('out-of-service-resources')).toHaveTextContent('1');
    expect(screen.getByText(/Projector B/i)).toBeInTheDocument();
  });
});
