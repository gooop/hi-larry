import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GitHubLink from './GitHubLink';

describe('GitHubLink', () => {
  let originalOpen: typeof window.open;

  beforeEach(() => {
    originalOpen = window.open;
    window.open = vi.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('opens the GitHub repository URL when clicked', async () => {
    const user = userEvent.setup();
    render(<GitHubLink />);

    const link = screen.getByRole('link', { name: /github/i });
    await user.click(link);

    expect(window.open).toHaveBeenCalledWith(
      'https://github.com/gooop/hi-larry',
      '_blank',
      'noopener,noreferrer'
    );
  });
});