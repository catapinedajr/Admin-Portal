import { ReactNode } from "react";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  // BYPASS AUTH - for development only
  return <>{children}</>;
}
