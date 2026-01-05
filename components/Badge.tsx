interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "violet" | "default";
  className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    cyan: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30",
    violet: "bg-accent-violet/20 text-accent-violet border-accent-violet/30",
    default: "bg-border text-foreground-muted border-border",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}



