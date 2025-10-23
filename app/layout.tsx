import { Assistant } from "next/font/google";
import "../ui/main.css";

const font = Assistant({
  variable: "--font-geist-sans",
  subsets: ["hebrew"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${font.variable} antialiased`}>{children}</body>
    </html>
  );
}
