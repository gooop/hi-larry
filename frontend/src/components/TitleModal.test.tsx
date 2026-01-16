import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TitleModal from './TitleModal';

describe('TitleModal', () => {
  const defaultProps = {
    filename: 'test-file.txt',
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    render(<TitleModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a dialog when isOpen is true', () => {
    render(<TitleModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit File Metadata')).toBeInTheDocument();
  });

  it('renders an input field with Title placeholder', () => {
    render(<TitleModal {...defaultProps} />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  });

  it('renders confirm and cancel buttons', () => {
    render(<TitleModal {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /confirm/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TitleModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the modal (on backdrop)', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TitleModal {...defaultProps} onClose={onClose} />);

    const backdrop = screen.getByTestId('modal-backdrop');
    await user.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal content', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TitleModal {...defaultProps} onClose={onClose} />);

    const input = screen.getByPlaceholderText('Title');
    await user.click(input);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TitleModal {...defaultProps} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with filename and title when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TitleModal {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Title');
    await user.type(input, 'My Document Title');
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    expect(onSubmit).toHaveBeenCalledWith('test-file.txt', 'My Document Title');
  });

  it('calls onSubmit with filename and title when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TitleModal {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Title');
    await user.type(input, 'My Document Title');
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('test-file.txt', 'My Document Title');
  });

  it('clears the input when modal is closed and reopened', async () => {
    const { rerender } = render(<TitleModal {...defaultProps} />);

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Title');
    await user.type(input, 'Some Title');

    // Close the modal
    rerender(<TitleModal {...defaultProps} isOpen={false} />);

    // Reopen the modal
    rerender(<TitleModal {...defaultProps} isOpen={true} />);

    const newInput = screen.getByPlaceholderText('Title');
    expect(newInput).toHaveValue('');
  });

  it('displays the filename in the modal', () => {
    render(<TitleModal {...defaultProps} filename="important-document.pdf" />);

    expect(screen.getByText(/important-document\.pdf/)).toBeInTheDocument();
  });

  it('does not call onSubmit when title is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TitleModal {...defaultProps} onSubmit={onSubmit} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not call onSubmit when title is only whitespace', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TitleModal {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Title');
    await user.type(input, '   ');

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
