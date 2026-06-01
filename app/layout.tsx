import type { ReactNode } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";

type RootLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
