import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import TypeIcon from './TypeIcon.tsx';

describe('typeIcon', () => {
  it('renders nothing with no type', () => {
    render(<TypeIcon type={undefined} />);

    expect(screen.queryByRole('paragraph')).toBeNull();
  });

  it.each([
    { type: 'Book', icon: '🕮\uFE0E', titleText: 'Book' },
    { type: 'E-book', icon: '🕮\uFE0E', titleText: 'Book' },
    { type: 'Audiobook', icon: '♫\uFE0E', titleText: 'Audiobook' },
    { type: 'Anthology', icon: '📚\uFE0E', titleText: 'Anthology' },
    { type: 'Essay', icon: '🗏\uFE0E', titleText: 'Essay' },
  ])(
    'renders $icon when type is $type with title: $titleText',
    ({ type, icon, titleText }) => {
      render(<TypeIcon type={type} />);

      let badge = screen.getByText(icon);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('title', titleText);
    }
  );
});
