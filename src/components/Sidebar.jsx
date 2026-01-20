import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import useUserStore from '../stores/userStore'

const Sidebar = ({ isOpen, onClose }) => {
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

  // 모바일에서 메뉴 클릭 시 사이드바 닫기
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  // 모바일에서 ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // 모바일에서 사이드바 열려있을 때 body 스크롤 방지
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* 모바일 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          w-60 bg-white border-r border-gray-200 h-screen fixed left-0 top-16 shadow-sm z-50
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* 모바일에서 닫기 버튼 */}
        <div className="md:hidden flex justify-end p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="메뉴 닫기"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {visibleMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path === '/dashboard' ? '/' : item.path}
                  onClick={handleLinkClick}
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
    </>
  )
}

export default Sidebar
