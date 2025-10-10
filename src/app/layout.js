import '@fontsource/poppins';
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';
import UserContextProvider from '@/context/userContext';

export const metadata = {
  title: "PasswordVault",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <UserContextProvider>
          <div className="w-screen h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 overflow-y-auto p-5">
              {children}
            </div>
          </div>
        </UserContextProvider>

        <Toaster position="bottom-right" toastOptions={{className: 'text-sm sm:text-base'}}/>
      </body>
    </html>
  );
}
