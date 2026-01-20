import { useNavigate, Link } from 'react-router-dom'
import useUserStore from '../stores/userStore'

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const logout = useUserStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between w-full">
        {/* 좌측: 햄버거 메뉴 버튼 (모바일만) + 로고/프로그램명 */}
        <div className="flex items-center gap-3">
          {/* 햄버거 메뉴 버튼 - 모바일에서만 표시 */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="메뉴 열기"
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
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <Link to="/" className="text-xl font-bold text-gray-900 hover:text-slate-700 transition-colors">
            Q-Track
          </Link>
        </div>

        {/* 우측: 사용자 정보 + 로그아웃 버튼 */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-lg text-sm font-medium">
                {user.username} <span className="text-xs text-gray-500">({user.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-800 text-white border-2 border-slate-800 rounded-lg text-sm font-medium shadow-md hover:bg-slate-700 hover:border-slate-700 transition-all duration-200"
              >
                로그아웃
              </button>
            </>
          ) : (
            <span className="text-sm text-gray-500">로그인 필요</span>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
