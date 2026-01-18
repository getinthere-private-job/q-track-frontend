import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import LoginForm from '../components/forms/LoginForm'
import useUserStore from '../stores/userStore'

const LoginPage = () => {
  const navigate = useNavigate()
  const token = useUserStore((state) => state.token)
  const user = useUserStore((state) => state.user)

  // 토큰과 사용자 정보가 있으면 자동으로 대시보드로 리다이렉트
  useEffect(() => {
    if (token && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [token, user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Q-Track</h1>
          <p className="text-sm text-gray-600">품질 관리 시스템에 로그인하세요</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link
              to="/signup"
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
