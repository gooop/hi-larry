interface DropdownProps {
  label: string;
  value: string;
  setFn: (value: string) => void;
}

export default function Dropdown({ label, value, setFn }: DropdownProps) {
  return (
    <div className="input-group">
      <select
        id={label}
        className="input dropdown"
        value={value}
        onChange={(e) => setFn(e.target.value)}
      >
        <option value=""></option>
        <option value="Book">Book</option>
        <option value="Audiobook">Audiobook</option>
        <option value="Anthology">Anthology</option>
        <option value="Essay">Essay</option>
        <option value="Whitepaper">Whitepaper</option>
      </select>
      <label htmlFor={label} className="input-label">
        {label}
      </label>
    </div>
  );
}
