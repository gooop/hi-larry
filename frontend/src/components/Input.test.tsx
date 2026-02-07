import { useState } from 'react';
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
        value={'Value'}
        setFn={() => {}}
      ></Input>
    );

    let input = screen.getByLabelText('Label');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Value');
    expect(input).toHaveAttribute('placeholder', 'Placeholder');
  });

  it('calls back to setFn when set', async () => {
    const setFn = vi.fn();

    function Wrapper() {
      const [value, setValue] = useState('');
      return (
        <Input
          label={'Label'}
          placeholder={'Another Placeholder'}
          value={value}
          setFn={(v) => {
            setValue(v);
            setFn(v);
          }}
        />
      );
    }

    render(<Wrapper />);

    let input = screen.getByPlaceholderText('Another Placeholder');
    expect(input).toBeInTheDocument();

    await userEvent.type(input, 'Some string!');

    expect(setFn).toHaveBeenCalledWith('Some string!');
  });
});
