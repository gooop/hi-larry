import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from './Dropdown.tsx';

describe('Dropdown', () => {
  it('renders a select with a label', () => {
    render(<Dropdown label="Type" value="" setFn={() => {}} />);

    expect(screen.getByLabelText('Type')).toBeInTheDocument();
  });

  it('calls setFn when an option is selected', async () => {
    const setFn = vi.fn();
    const user = userEvent.setup();
    render(<Dropdown label="Type" value="" setFn={setFn} />);

    await user.selectOptions(screen.getByLabelText('Type'), 'Audiobook');

    expect(setFn).toHaveBeenCalledWith('Audiobook');
  });

  it('reflects the current value', () => {
    render(<Dropdown label="Type" value="Essay" setFn={() => {}} />);

    expect(screen.getByLabelText('Type')).toHaveValue('Essay');
  });

  it('renders all type options plus an empty default', () => {
    render(<Dropdown label="Type" value="" setFn={() => {}} />);

    const options = screen.getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual([
      '',
      'Book',
      'E-book',
      'Audiobook',
      'Anthology',
      'Essay',
    ]);
  });
});
