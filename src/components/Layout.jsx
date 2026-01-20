import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <main className="md:ml-60 pt-16">
        <div className="max-w-7xl mx-auto p-6">
          {title && (
            <h1 className="text-lg font-semibold text-gray-900 mb-6">{title}</h1>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
