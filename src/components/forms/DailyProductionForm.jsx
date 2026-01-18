import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ko } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import { useItems } from '../../hooks/useItems'
import { useCreateDailyProduction, useUpdateDailyProduction } from '../../hooks/useDailyProductions'
import useUserStore from '../../stores/userStore'

// 한국어 로케일 등록
registerLocale('ko', ko)

const DailyProductionForm = () => {
  const user = useUserStore((state) => state.user)
  const { data: items, isLoading: itemsLoading } = useItems()
  const createMutation = useCreateDailyProduction()
  const updateMutation = useUpdateDailyProduction()

  const [formData, setFormData] = useState({
    itemId: '',
    productionDate: null, // Date 객체로 관리
    totalQuantity: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  // 수정 모드로 전환
  const handleEdit = (dailyProduction) => {
    setFormData({
      itemId: String(dailyProduction.itemId),
      productionDate: dailyProduction.productionDate ? new Date(dailyProduction.productionDate) : null,
      totalQuantity: String(dailyProduction.totalQuantity)
    })
    setEditingId(dailyProduction.id)
    setErrors({})
  }

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
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.itemId) {
      newErrors.itemId = '부품을 선택하세요'
    }

    if (!formData.productionDate) {
      newErrors.productionDate = '생산일을 선택하세요'
    }

    if (!formData.totalQuantity) {
      newErrors.totalQuantity = '총 생산량을 입력하세요'
    } else {
      const quantity = parseInt(formData.totalQuantity, 10)
      if (isNaN(quantity) || quantity < 0) {
        newErrors.totalQuantity = '0 이상의 숫자를 입력하세요'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      // Date 객체를 yyyy-MM-dd 형식으로 변환
      const formatDate = (date) => {
        if (!date) return ''
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      const data = {
        itemId: parseInt(formData.itemId, 10),
        productionDate: formatDate(formData.productionDate),
        totalQuantity: parseInt(formData.totalQuantity, 10)
      }

      if (editingId) {
        // 수정
        await updateMutation.mutateAsync({
          id: editingId,
          data: { totalQuantity: data.totalQuantity }
        })
      } else {
        // 생성
        await createMutation.mutateAsync(data)
      }

      // 폼 초기화
      setFormData({
        itemId: '',
        productionDate: null,
        totalQuantity: ''
      })
      setEditingId(null)
      setErrors({})
    } catch (error) {
      // 에러 처리 (중복 입력 등)
      if (error.response?.data?.msg) {
        setErrors({ submit: error.response.data.msg })
      } else {
        setErrors({ submit: '저장에 실패했습니다. 다시 시도해주세요.' })
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      itemId: '',
      productionDate: null,
      totalQuantity: ''
    })
    setEditingId(null)
    setErrors({})
  }

  // 권한 확인: USER, MANAGER, ADMIN 모두 접근 가능
  const canManage = user && (user.role === 'USER' || user.role === 'MANAGER' || user.role === 'ADMIN')

  if (!canManage) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-sm text-gray-600">데이터 입력 권한이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {editingId ? '일별 생산 데이터 수정' : '일별 생산 데이터 입력'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 에러 메시지 */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* 부품 선택 */}
        <div>
          <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-2">
            부품 <span className="text-red-500">*</span>
          </label>
          <select
            id="itemId"
            name="itemId"
            value={formData.itemId}
            onChange={handleChange}
            disabled={editingId !== null || itemsLoading}
            className={`w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 ${
              errors.itemId ? 'border-red-500' : 'border-gray-300'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            <option value="">부품을 선택하세요</option>
            {items &&
              items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} - {item.name}
                </option>
              ))}
          </select>
          {errors.itemId && <p className="mt-1 text-sm text-red-600">{errors.itemId}</p>}
        </div>

        {/* 생산일 선택 */}
        <div>
          <label htmlFor="productionDate" className="block text-sm font-medium text-gray-700 mb-2">
            생산일 <span className="text-red-500">*</span>
          </label>
          <DatePicker
            id="productionDate"
            selected={formData.productionDate}
            onChange={(date) => {
              setFormData((prev) => ({
                ...prev,
                productionDate: date
              }))
              // 입력 시 에러 메시지 초기화
              if (errors.productionDate) {
                setErrors((prev) => ({
                  ...prev,
                  productionDate: ''
                }))
              }
            }}
            disabled={editingId !== null}
            locale="ko"
            dateFormat="yyyy-MM-dd"
            placeholderText="생산일을 선택하세요"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
              errors.productionDate ? 'border-red-500' : 'border-gray-300'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            wrapperClassName="w-full"
            calendarClassName="!scale-125"
            popperClassName="z-50"
          />
          {errors.productionDate && (
            <p className="mt-1 text-sm text-red-600">{errors.productionDate}</p>
          )}
        </div>

        {/* 총 생산량 입력 */}
        <div>
          <label htmlFor="totalQuantity" className="block text-sm font-medium text-gray-700 mb-2">
            총 생산량 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="totalQuantity"
            name="totalQuantity"
            value={formData.totalQuantity}
            onChange={handleChange}
            min="0"
            step="1"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
              errors.totalQuantity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="총 생산량을 입력하세요"
          />
          {errors.totalQuantity && (
            <p className="mt-1 text-sm text-red-600">{errors.totalQuantity}</p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending || updateMutation.isPending
              ? '저장 중...'
              : editingId
              ? '수정'
              : '저장'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DailyProductionForm
