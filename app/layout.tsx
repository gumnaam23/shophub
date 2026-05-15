import './globals.css';
import Navbar from './components/layout/Navbar';
import { Providers } from './providers';
import Footer from './components/layout/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <head>
          {/* Add CSP meta tag as fallback */}
          <meta
            httpEquiv="Content-Security-Policy"
            content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http: *.clerk.accounts.dev *.clerk.com challenges.cloudflare.com; connect-src 'self' https: http: ws: wss: *.clerk.accounts.dev *.clerk.com; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: https: http:; frame-src https: http:;"
          />
        </head>
        <body>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </Providers>
  );
}