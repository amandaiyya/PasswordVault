import '@fontsource/poppins';
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "PasswordVault",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <div className="w-screen h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-y-auto border border-sky-100">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
