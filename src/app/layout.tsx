import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Gerenciador de tarefas com plano de ação por IA",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <a href="/" className="text-lg font-bold text-blue-600 hover:text-blue-700">
              Task Manager
            </a>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
