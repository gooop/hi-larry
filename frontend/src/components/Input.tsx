interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  setFn: (value: string) => void;
}

export default function Input({
  label,
  placeholder,
  value,
  setFn,
}: InputProps) {
  return (
    <div className="input-group">
      <input
        type="text"
        id={label}
        className="input"
        value={value}
        onChange={(event) => setFn(event.target.value)}
        placeholder={placeholder}
      />
      <label htmlFor={label} className="input-label">
        {label}
      </label>
    </div>
  );
}
