import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteModal from './DeleteModal';

describe('DeleteModal', () => {
  const defaultProps = {
    filename: 'test-file.txt',
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    render(<DeleteModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a dialog when isOpen is true', () => {
    render(<DeleteModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays the filename being deleted', () => {
    render(<DeleteModal {...defaultProps} filename="important-document.pdf" />);

    expect(screen.getByText(/important-document\.pdf/)).toBeInTheDocument();
  });

  it('renders confirm and cancel buttons', () => {
    render(<DeleteModal {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /confirm/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders confirm button with danger styling', () => {
    render(<DeleteModal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('button-danger');
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DeleteModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the modal (on backdrop)', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DeleteModal {...defaultProps} onClose={onClose} />);

    const backdrop = screen.getByTestId('modal-backdrop');
    await user.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal content', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DeleteModal {...defaultProps} onClose={onClose} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DeleteModal {...defaultProps} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm with filename when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<DeleteModal {...defaultProps} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: /confirm/i }));

    expect(onConfirm).toHaveBeenCalledWith('test-file.txt');
  });

  it('calls onConfirm with filename when form is submitted via Enter key', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<DeleteModal {...defaultProps} onConfirm={onConfirm} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    confirmButton.focus();
    await user.keyboard('{Enter}');

    expect(onConfirm).toHaveBeenCalledWith('test-file.txt');
  });

  it('is rendered as a form element', () => {
    render(<DeleteModal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    const form = dialog.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('confirm button is a submit button', () => {
    render(<DeleteModal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveAttribute('type', 'submit');
  });
});
