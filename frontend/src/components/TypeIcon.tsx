interface TypeIconProps {
  type: string | undefined;
}

export default function TypeIcon({ type }: TypeIconProps) {
  // &#xFE0E; is a variation selector that forces text presentation.
  return (
    <>
      {type === 'Book' && (
        <p title="Book" className="file-item-type-badge book">
          🕮&#xFE0E;
        </p>
      )}
      {type === 'Audiobook' && (
        <p title="Audiobook" className="file-item-type-badge audiobook">
          ♫&#xFE0E;
        </p>
      )}
      {type === 'Anthology' && (
        <p title="Anthology" className="file-item-type-badge anthology">
          📚&#xFE0E;
        </p>
      )}
      {type === 'Essay' && (
        <p title="Essay" className="file-item-type-badge essay">
          🗏&#xFE0E;
        </p>
      )}
    </>
  );
}
