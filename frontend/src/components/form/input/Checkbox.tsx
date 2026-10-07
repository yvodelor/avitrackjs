

interface CheckboxProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function Checkbox({
  name,
  label,
  checked,
  onChange,

}: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-indigo-600"
      />
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );
}