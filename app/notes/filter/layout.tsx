import type { ReactNode } from "react";

type FilterLayoutProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "24px",
      }}
    >
      <aside style={{ minWidth: "220px" }}>{sidebar}</aside>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
