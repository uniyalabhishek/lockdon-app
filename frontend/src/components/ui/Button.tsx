interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button 
      className={`w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md lock-don-text ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 