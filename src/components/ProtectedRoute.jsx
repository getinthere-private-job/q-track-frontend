import { Navigate } from 'react-router-dom'
import useUserStore from '../stores/userStore'

const ProtectedRoute = ({ children }) => {
  const token = useUserStore((state) => state.token)
  const user = useUserStore((state) => state.user)

  // 토큰이 없거나 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
