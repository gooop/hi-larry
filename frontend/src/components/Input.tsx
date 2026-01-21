interface InputProps {
  label: string;
  placeholder: string;
  setFn: (value: string) => void;
}

export default function Input({ label, placeholder, setFn }: InputProps) {
  return (
    <div className="input-group">
      <input
        type="text"
        id={label}
        className="input"
        onChange={(event) => setFn(event.target.value)}
        placeholder={placeholder}
      />
      <label htmlFor={label} className="input-label">
        {label}
      </label>
    </div>
  );
}
