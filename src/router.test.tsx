import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

describe('Application Router Boundary', () => {
  it('successfully mounts the CineView application shell', () => {
    render(<RouterProvider router={router} />);
    
    // Verifies the shell header renders
    const headerElement = screen.getByText(/CineView Shell/i);
    expect(headerElement).toBeInTheDocument();
    
    // Verifies the default child route (Home) renders inside the shell
    const homePlaceholder = screen.getByText(/Home Page Placeholder/i);
    expect(homePlaceholder).toBeInTheDocument();
  });
});