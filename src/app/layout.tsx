import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "我的工具箱 - 实用在线工具集合",
  description: "汇集各种实用的 Web 小工具，包括密码生成器、二维码生成器、JSON 格式化等",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                我的工具箱
              </Link>
              <nav className="flex gap-6">
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  首页
                </Link>
                <Link href="/tools/password" className="text-gray-600 hover:text-blue-600 transition-colors">
                  密码生成器
                </Link>
                <Link href="/tools/json" className="text-gray-600 hover:text-blue-600 transition-colors">
                  JSON格式化
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
            我的工具箱 - 实用在线工具集合
          </div>
        </footer>
      </body>
    </html>
  );
}
