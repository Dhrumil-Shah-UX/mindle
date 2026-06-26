import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageShell({ children, className = "", narrow = false }: PageShellProps) {
  return (
    <main
      className={`mx-auto flex min-h-screen w-full flex-col px-5 py-10 sm:px-8 sm:py-14 ${
        narrow ? "max-w-lg" : "max-w-xl"
      } ${className}`}
    >
      {children}
    </main>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">{children}</p>
  );
}
