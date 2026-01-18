import { useNavigate, Link } from 'react-router-dom'
import useUserStore from '../stores/userStore'

const Header = () => {
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
        {/* 좌측: 로고/프로그램명 */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-gray-900 hover:text-slate-700 transition-colors">
            Q-Track
          </Link>
        </div>

        {/* 우측: 사용자 정보 + 로그아웃 버튼 */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">사용자:</span>
                <span className="text-sm font-medium text-gray-900">{user.username}</span>
                <span className="text-xs text-gray-500">({user.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
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
