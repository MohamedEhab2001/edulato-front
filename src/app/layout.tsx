import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edulato - منصة بيع الدورات والمنتجات الرقمية',
  description: 'منصة متكاملة للمعلمين ومنشئي المحتوى لبيع الدورات والمنتجات الرقمية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}