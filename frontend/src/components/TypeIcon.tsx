import bookIcon from '../../assets/book.svg';
import audiobookIcon from '../../assets/audiobook.svg';
import booksIcon from '../../assets/books.svg';
import pageIcon from '../../assets/page.svg';

interface TypeIconProps {
  type: string | undefined;
}

export default function TypeIcon({ type }: TypeIconProps) {
  let icon = null;
  switch (type) {
    case 'Book':
      icon = bookIcon;
      break;
    case 'Audiobook':
      icon = audiobookIcon;
      break;
    case 'Anthology':
      icon = booksIcon;
      break;
    case 'Essay':
    case 'Whitepaper':
      icon = pageIcon;
      break;
  }

  return (
    <>
      {icon != null ? (
        <p title={type} className="file-item-type-badge">
          <img src={icon} alt={type} />
        </p>
      ) : (
        <p title={type} className="file-item-type-badge"></p>
      )}
    </>
  );
}
