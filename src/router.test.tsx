import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

describe('Application Router Boundary', () => {
  it('successfully mounts the CineView application shell', () => {
    render(
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true }}
      />
    );

    expect(screen.getByText(/CineView/i)).toBeInTheDocument();
  });
});