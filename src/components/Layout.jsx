import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="ml-60 pt-16">
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
