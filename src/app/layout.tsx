import "./globals.css";

export const metadata = {
  title: "poster",
  description: "worlds greatest posting simulator"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
