import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LED World - Login",
  description: "Login to LED World - Premium Lighting Solutions",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
