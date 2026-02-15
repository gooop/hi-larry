import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import TypeIcon from './TypeIcon.tsx';
import bookIcon from '../../assets/book.svg';
import audiobookIcon from '../../assets/audiobook.svg';
import booksIcon from '../../assets/books.svg';
import pageIcon from '../../assets/page.svg';

describe('typeIcon', () => {
  it('renders nothing with no type', () => {
    render(<TypeIcon type={undefined} />);

    expect(screen.queryByRole('img')).toBeNull();
  });

  it.each([
    { type: 'Book', alt: 'Book', expectedIcon: bookIcon },
    { type: 'Audiobook', alt: 'Audiobook', expectedIcon: audiobookIcon },
    { type: 'Anthology', alt: 'Anthology', expectedIcon: booksIcon },
    { type: 'Essay', alt: 'Essay', expectedIcon: pageIcon },
    { type: 'Whitepaper', alt: 'Whitepaper', expectedIcon: pageIcon },
  ])(
    'renders an SVG img when type is $type',
    ({ type, alt, expectedIcon }) => {
      render(<TypeIcon type={type} />);

      let img = screen.getByRole('img', { name: alt });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', alt);
      expect(img).toHaveAttribute('src', expectedIcon);

      let badge = img.closest('p');
      expect(badge).toHaveAttribute('title', type);
      expect(badge).toHaveClass('file-item-type-badge');
    }
  );
});