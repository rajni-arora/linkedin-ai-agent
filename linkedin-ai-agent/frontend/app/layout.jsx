import './globals.css'

export const metadata = {
  title: 'LinkedIn AI Agent',
  description: 'Generate LinkedIn posts powered by AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
