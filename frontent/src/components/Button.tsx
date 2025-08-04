type VariantKey = "green" | "orange" | "orange-light" | "green-light";
type Variants = Record<VariantKey, string>;

interface Props {
  onClick: () => void;
  variant?: VariantKey;
  disabled?: boolean;
}

const Button: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onClick,
  disabled,
  variant = "green",
}) => {
  const variants: Variants = {
    green: "bg-green-400 hover:bg-green-500 text-white",
    orange: "bg-button-orange hover:bg-button-orange-hover text-white",
    "orange-light":
      "bg-button-orange-light hover:bg-orange-300 text-button-orange-light-text",
    "green-light":
      "bg-button-green-light hover:bg-emerald-200 text-button-green-light-text",
  };

  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 text-base rounded-sm font-medium transition-colors min-w-[100px] ${variants[variant]}`}
      disabled={disabled || false}
    >
      {children}
    </button>
  );
};

export default Button;
