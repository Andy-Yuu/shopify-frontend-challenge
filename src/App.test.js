import { render, screen } from '@testing-library/react';
import App from './App';

test('renders initial page', async () => {
  render(<App />);
  expect(screen.getByText(/Spacestagram/i)).toBeInTheDocument();
  expect(screen.getByText(/Fetch Random Astronomy Picture of the Day/i)).toBeInTheDocument();
});
