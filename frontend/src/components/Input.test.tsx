import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Input from './Input.tsx';
import userEvent from '@testing-library/user-event';

describe('Input', () => {
  it('renders with placeholder text and label', () => {
    render(
      <Input
        label={'Label'}
        placeholder={'Placeholder'}
        setFn={() => {}}
      ></Input>
    );

    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Placeholder')).toBeInTheDocument();
  });

  it('calls back to setFn when set', async () => {
    const setFn = vi.fn();
    render(
      <Input
        label={'Label'}
        placeholder={'Another Placeholder'}
        setFn={setFn}
      ></Input>
    );

    let input = screen.getByPlaceholderText('Another Placeholder');
    expect(input).toBeInTheDocument();

    await userEvent.type(input, 'Some string!');

    expect(setFn).toHaveBeenCalledWith('Some string!');
  });
});
