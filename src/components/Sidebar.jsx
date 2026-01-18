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
    <aside className="w-60 bg-gray-50 border-r border-gray-200 h-screen fixed left-0 top-16">
      <nav className="p-4">
        <ul className="space-y-1">
          {visibleMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path === '/dashboard' ? '/' : item.path}
                className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-slate-50 text-slate-800 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
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
