import { Link, useLocation } from 'react-router-dom'
import useUserStore from '../stores/userStore'

const Sidebar = () => {
  const location = useLocation()
  const user = useUserStore((state) => state.user)

  const menuItems = [
    {
      path: '/dashboard',
      label: '대시보드',
      roles: ['USER', 'MANAGER', 'ADMIN']
    },
    {
      path: '/data-input',
      label: '데이터 입력',
      roles: ['USER', 'MANAGER', 'ADMIN']
    },
    {
      path: '/quality-records',
      label: '품질 기록',
      roles: ['MANAGER', 'ADMIN']
    },
    {
      path: '/items',
      label: '부품 관리',
      roles: ['MANAGER', 'ADMIN']
    }
  ]

  // 현재 사용자 권한에 맞는 메뉴만 필터링
  const visibleMenuItems = user
    ? menuItems.filter((item) => item.roles.includes(user.role))
    : []

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 h-screen fixed left-0 top-16 shadow-sm">
      <nav className="p-4">
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path === '/dashboard' ? '/' : item.path}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-slate-800 text-white shadow-md border-2 border-slate-800'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
