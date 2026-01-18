import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../api/client'

const SignupForm = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'USER'
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    // 입력 시 에러 메시지 초기화
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = '사용자명을 입력하세요'
    } else if (formData.username.trim().length < 3) {
      newErrors.username = '사용자명은 3자 이상이어야 합니다'
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력하세요'
    } else if (formData.password.length < 4) {
      newErrors.password = '비밀번호는 4자 이상이어야 합니다'
    }

    if (!formData.role) {
      newErrors.role = '권한을 선택하세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      await apiClient.post('/users/signup', {
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role
      })

      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/login', {
        state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' }
      })
    } catch (error) {
      // 에러 처리
      if (error.response?.data?.msg) {
        setErrorMessage(error.response.data.msg)
      } else {
        setErrorMessage('회원가입에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 에러 메시지 */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* 사용자명 입력 */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          사용자명
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
            errors.username ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="사용자명을 입력하세요 (3자 이상)"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="비밀번호를 입력하세요 (4자 이상)"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* 권한 선택 */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          권한
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 ${
            errors.role ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="USER">USER (일반 사용자)</option>
          <option value="MANAGER">MANAGER (관리자)</option>
          <option value="ADMIN">ADMIN (최고 관리자)</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
        )}
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '회원가입 중...' : '회원가입'}
      </button>
    </form>
  )
}

export default SignupForm
