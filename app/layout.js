
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Next.js Admin Dashboard',
  description: 'A comprehensive admin dashboard built with Next.js.',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
