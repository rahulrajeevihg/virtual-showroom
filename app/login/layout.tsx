import "../globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-ledworld-d.png" />
        <link rel="apple-touch-icon" href="/logo-ledworld-d.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo-ledworld-d.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo-ledworld-d.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <title>LED World - Login</title>
      </head>
      <body className={montserrat.className + ' overflow-x-hidden'}>
        {children}
      </body>
    </html>
  );
}
