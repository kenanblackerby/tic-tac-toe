import { render, screen } from '@testing-library/react';
import Board from './index.js';

test('renders Next player text', () => {
  render(<Game />);
  const linkElement = screen.getByText(/Next player: X/i);
  expect(linkElement).toBeInTheDocument();
});
