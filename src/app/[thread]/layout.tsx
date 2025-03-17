import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NextTopLoader />
      {children}
    </>
  );
}
