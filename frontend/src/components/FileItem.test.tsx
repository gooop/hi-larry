import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FileItem from './FileItem.tsx';
import userEvent from '@testing-library/user-event';

describe('FileItem', () => {
  //TODO: fix this test
  it('is collapsed on initial render', () => {
    render(
      <FileItem
        fileMetadata={{
          filename: 'A_file_name',
          title: 'A file',
          author: 'An author',
          type: 'A type',
        }}
        onDownload={() => {}}
        onEditMetadata={() => {}}
        openDeleteModal={() => {}}
      />
    );

    expect(screen.getByText('► A file')).toBeInTheDocument();
    let downloadButton = screen.getByRole('button', { name: /download/i });
    expect(downloadButton).toHaveAttribute('type', 'button');
    let deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toHaveAttribute('type', 'button');
    expect(screen.getByText('by: An author')).toBeInTheDocument();

    // For animation reasons, these things are always in the dom. I think I'll have to assert on the classes
    // expect(screen.queryByText(`File Name: A_file_name`)).toBeNull();
    // expect(screen.queryByLabelText('Title')).toBeNull();
  });

  //TODO: fix this test
  it('expands on click', async () => {
    let filename = 'A_file_name';
    let title = 'A file';
    let author = 'Bo Jenkins';
    let type = 'Book';
    render(
      <FileItem
        fileMetadata={{
          filename,
          title,
          author,
          type,
        }}
        onDownload={() => {}}
        onEditMetadata={() => {}}
        openDeleteModal={() => {}}
      />
    );

    const spanToClick = screen.getByText(`► ${title}`);
    await userEvent.click(spanToClick);

    expect(screen.getByText(`▼ ${title}`)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();

    expect(screen.getByText(`File Name: ${filename}`)).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Author')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('A file')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bo Jenkins')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).toHaveValue('Book');

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveAttribute('type', 'button');
  });

  it('displays a nice icon with metadata', () => {
    let filename = 'A_file_name';
    let title = 'A file';
    let author = 'Bo Jenkins';
    const renderWithType = (type: string): typeof unmount => {
      const { unmount } = render(
        <FileItem
          fileMetadata={{
            filename,
            title,
            author,
            type,
          }}
          onDownload={() => {}}
          onEditMetadata={() => {}}
          openDeleteModal={() => {}}
        />
      );
      return unmount;
    };

    let unmount = renderWithType('E-book');
    expect(screen.getByText('🕮\uFE0E')).toBeInTheDocument();
    expect(screen.queryByText('♫\uFE0E')).toBeNull();
    unmount();

    unmount = renderWithType('Book');
    expect(screen.getByText('🕮\uFE0E')).toBeInTheDocument();
    expect(screen.queryByText('♫\uFE0E')).toBeNull();
    unmount();

    unmount = renderWithType('Audiobook');
    expect(screen.getByText('♫\uFE0E')).toBeInTheDocument();
    expect(screen.queryByText('🕮\uFE0E')).toBeNull();
    unmount();

    unmount = renderWithType('Anthology');
    expect(screen.getByText('📚\uFE0E')).toBeInTheDocument();
    unmount();

    unmount = renderWithType('Essay');
    expect(screen.getByText('🗏\uFE0E')).toBeInTheDocument();
    expect(screen.queryByText('🕮\uFE0E')).toBeNull();
    unmount();
  });

  it('calls back with correct information on save', async () => {
    const filename = 'A_file_name';
    const title = 'A file';
    const author = 'Bo Jenkins';
    const type = 'E-book';
    const editMetadataFn = vi.fn();
    render(
      <FileItem
        fileMetadata={{
          filename,
          title,
          author,
          type,
        }}
        onDownload={() => {}}
        onEditMetadata={editMetadataFn}
        openDeleteModal={() => {}}
      />
    );

    const spanToClick = screen.getByText(`► ${title}`);
    await userEvent.click(spanToClick);
    let saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();

    const titleInput = screen.getByPlaceholderText('A file');
    await userEvent.type(titleInput, 'A cool title!');

    const authorInput = screen.getByPlaceholderText('Bo Jenkins');
    await userEvent.type(authorInput, 'Author Authorson');
    await userEvent.selectOptions(screen.getByLabelText('Type'), 'Audiobook');

    saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);
    expect(editMetadataFn).toHaveBeenCalledWith({
      filename,
      title: 'A cool title!',
      author: 'Author Authorson',
      type: 'Audiobook',
    });
  });

  it('calls back with partial information on save', async () => {
    const filename = 'A_file_name';
    const title = 'A file';
    const author = 'Bo Jenkins';
    const type = 'E-book';
    const editMetadataFn = vi.fn();
    render(
      <FileItem
        fileMetadata={{
          filename,
          title,
          author,
          type,
        }}
        onDownload={() => {}}
        onEditMetadata={editMetadataFn}
        openDeleteModal={() => {}}
      />
    );

    const spanToClick = screen.getByText(`► ${title}`);
    await userEvent.click(spanToClick);
    let saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();

    const titleInput = screen.getByPlaceholderText('A file');
    await userEvent.type(titleInput, 'A cool title!');

    const authorInput = screen.getByPlaceholderText('Bo Jenkins');
    await userEvent.type(authorInput, 'Author Authorson');

    saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);
    expect(editMetadataFn).toHaveBeenCalledWith({
      filename,
      title: 'A cool title!',
      author: 'Author Authorson',
    });
  });

  it('calls openDeleteModal when delete button is pressed', async () => {
    const user = userEvent.setup();
    const openDeleteFn = vi.fn();

    render(
      <FileItem
        fileMetadata={{
          filename: 'filename',
          title: 'A, title',
          author: 'author',
          type: 'type',
        }}
        onDownload={() => {}}
        onEditMetadata={() => {}}
        openDeleteModal={openDeleteFn}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(openDeleteFn).toHaveBeenCalledWith('filename');
  });

  it('calls onDownload when download button is pressed', async () => {
    const user = userEvent.setup();
    const downloadFn = vi.fn();

    render(
      <FileItem
        fileMetadata={{
          filename: 'filename',
          title: 'A, title',
          author: 'author',
          type: 'type',
        }}
        onDownload={downloadFn}
        onEditMetadata={() => {}}
        openDeleteModal={() => {}}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /download/i });
    await user.click(deleteButton);

    expect(downloadFn).toHaveBeenCalledWith('filename');
  });

  it('shows the current type as the selected dropdown value', async () => {
    render(
      <FileItem
        fileMetadata={{
          filename: 'test-file.txt',
          title: 'A Title',
          author: 'An Author',
          type: 'Audiobook',
        }}
        onDownload={() => {}}
        onEditMetadata={() => {}}
        openDeleteModal={() => {}}
      />
    );

    await userEvent.click(screen.getByText('► A Title'));

    expect(screen.getByLabelText('Type')).toHaveValue('Audiobook');
  });

  it('resets input state when dropdown is closed and reopened', async () => {
    const user = userEvent.setup();
    const title = 'Original Title';
    const author = 'Original Author';

    render(
      <FileItem
        fileMetadata={{
          filename: 'test-file.txt',
          title,
          author,
          type: 'E-book',
        }}
        onDownload={() => {}}
        onEditMetadata={() => {}}
        openDeleteModal={() => {}}
      />
    );

    // Open dropdown
    await user.click(screen.getByText(`► ${title}`));
    const titleInput = screen.getByLabelText('Title');
    expect(titleInput).toHaveAttribute('placeholder', title);

    // Type in the title input
    await user.type(titleInput, 'Modified Title');
    expect(titleInput).toHaveValue('Modified Title');
    expect(titleInput).toHaveAttribute('placeholder', 'Original Title');

    // Close dropdown
    await user.click(screen.getByText(`▼ ${title}`));

    // Reopen dropdown - input should be reset to original value
    await user.click(screen.getByText(`► ${title}`));
    const reopenedTitleInput = screen.getByLabelText('Title');
    expect(reopenedTitleInput).toHaveValue('');
    expect(reopenedTitleInput).toHaveAttribute('placeholder', title);
  });
});
