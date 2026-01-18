import { useState, useMemo } from 'react'
import { useDailyProductions } from '../../hooks/useDailyProductions'
import { useProcesses } from '../../hooks/useProcesses'
import { useItems } from '../../hooks/useItems'
import { useCreateQualityRecord, useUpdateQualityRecord } from '../../hooks/useQualityRecords'
import useUserStore from '../../stores/userStore'

const QualityRecordForm = () => {
  const user = useUserStore((state) => state.user)
  const { data: dailyProductions, isLoading: dailyProductionsLoading } = useDailyProductions()
  const { data: processes, isLoading: processesLoading } = useProcesses()
  const { data: items } = useItems()
  const createMutation = useCreateQualityRecord()
  const updateMutation = useUpdateQualityRecord()

  // 부품명 찾기 헬퍼
  const getItemName = (itemId) => {
    const item = items?.find((i) => i.id === itemId)
    return item ? `${item.code} - ${item.name}` : itemId
  }

  const [formData, setFormData] = useState({
    dailyProductionId: '',
    processId: '',
    okQuantity: '',
    ngQuantity: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  // 총 수량 및 NG 비율 자동 계산
  const calculatedValues = useMemo(() => {
    const okQty = parseInt(formData.okQuantity, 10) || 0
    const ngQty = parseInt(formData.ngQuantity, 10) || 0
    const totalQty = okQty + ngQty
    const ngRate = totalQty > 0 ? (ngQty / totalQty) * 100 : 0
    const isExceedingThreshold = ngRate > 0.5 // 업계 평균 0.5% 초과 여부

    return {
      totalQuantity: totalQty,
      ngRate: ngRate.toFixed(2),
      isExceedingThreshold
    }
  }, [formData.okQuantity, formData.ngQuantity])

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

    if (!formData.dailyProductionId) {
      newErrors.dailyProductionId = '일별 생산 데이터를 선택하세요'
    }

    if (!formData.processId) {
      newErrors.processId = '공정을 선택하세요'
    }

    if (!formData.okQuantity) {
      newErrors.okQuantity = 'OK 수량을 입력하세요'
    } else {
      const okQty = parseInt(formData.okQuantity, 10)
      if (isNaN(okQty) || okQty < 0) {
        newErrors.okQuantity = '0 이상의 숫자를 입력하세요'
      }
    }

    if (!formData.ngQuantity) {
      newErrors.ngQuantity = 'NG 수량을 입력하세요'
    } else {
      const ngQty = parseInt(formData.ngQuantity, 10)
      if (isNaN(ngQty) || ngQty < 0) {
        newErrors.ngQuantity = '0 이상의 숫자를 입력하세요'
      }
    }

    // 총 수량 검증: 선택한 일별 생산 데이터의 총 생산량과 일치해야 함
    if (formData.dailyProductionId && formData.okQuantity && formData.ngQuantity) {
      const selectedDailyProduction = dailyProductions?.find(
        (dp) => dp.id === parseInt(formData.dailyProductionId, 10)
      )
      if (selectedDailyProduction) {
        const okQty = parseInt(formData.okQuantity, 10)
        const ngQty = parseInt(formData.ngQuantity, 10)
        const totalQty = okQty + ngQty

        if (totalQty !== selectedDailyProduction.totalQuantity) {
          newErrors.submit = `총 수량(${totalQty})이 일별 생산 데이터의 총 생산량(${selectedDailyProduction.totalQuantity})과 일치하지 않습니다.`
        }
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
      const data = {
        dailyProductionId: parseInt(formData.dailyProductionId, 10),
        processId: parseInt(formData.processId, 10),
        okQuantity: parseInt(formData.okQuantity, 10),
        ngQuantity: parseInt(formData.ngQuantity, 10)
      }

      if (editingId) {
        // 수정
        await updateMutation.mutateAsync({
          id: editingId,
          data: {
            okQuantity: data.okQuantity,
            ngQuantity: data.ngQuantity
          }
        })
      } else {
        // 생성
        await createMutation.mutateAsync(data)
      }

      // 폼 초기화
      setFormData({
        dailyProductionId: '',
        processId: '',
        okQuantity: '',
        ngQuantity: ''
      })
      setEditingId(null)
      setErrors({})
    } catch (error) {
      // 에러 처리
      if (error.response?.data?.msg) {
        setErrors({ submit: error.response.data.msg })
      } else {
        setErrors({ submit: '저장에 실패했습니다. 다시 시도해주세요.' })
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      dailyProductionId: '',
      processId: '',
      okQuantity: '',
      ngQuantity: ''
    })
    setEditingId(null)
    setErrors({})
  }

  // 일별 생산 데이터 표시 형식 (부품명 - 생산일 - 총 생산량)
  const getDailyProductionLabel = (dp) => {
    const itemName = getItemName(dp.itemId)
    return `${itemName} - ${dp.productionDate} - ${dp.totalQuantity.toLocaleString()}개`
  }

  // 권한 확인: USER, MANAGER, ADMIN 모두 접근 가능
  const canManage = user && (user.role === 'USER' || user.role === 'MANAGER' || user.role === 'ADMIN')

  if (!canManage) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-sm text-gray-600">품질 기록 입력 권한이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {editingId ? '품질 기록 수정' : '품질 기록 입력'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 에러 메시지 */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* 일별 생산 데이터 선택 */}
        <div>
          <label htmlFor="dailyProductionId" className="block text-sm font-medium text-gray-700 mb-2">
            일별 생산 데이터 <span className="text-red-500">*</span>
          </label>
          <select
            id="dailyProductionId"
            name="dailyProductionId"
            value={formData.dailyProductionId}
            onChange={handleChange}
            disabled={editingId !== null || dailyProductionsLoading}
            className={`w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 ${
              errors.dailyProductionId ? 'border-red-500' : 'border-gray-300'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            <option value="">일별 생산 데이터를 선택하세요</option>
            {dailyProductions &&
              dailyProductions.map((dp) => (
                <option key={dp.id} value={dp.id}>
                  {getDailyProductionLabel(dp)}
                </option>
              ))}
          </select>
          {errors.dailyProductionId && <p className="mt-1 text-sm text-red-600">{errors.dailyProductionId}</p>}
        </div>

        {/* 공정 선택 */}
        <div>
          <label htmlFor="processId" className="block text-sm font-medium text-gray-700 mb-2">
            공정 <span className="text-red-500">*</span>
          </label>
          <select
            id="processId"
            name="processId"
            value={formData.processId}
            onChange={handleChange}
            disabled={editingId !== null || processesLoading}
            className={`w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 ${
              errors.processId ? 'border-red-500' : 'border-gray-300'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            <option value="">공정을 선택하세요</option>
            {processesLoading && (
              <option value="" disabled>
                로딩 중...
              </option>
            )}
            {!processesLoading && processes && processes.length > 0
              ? processes.map((process) => (
                  <option key={process.id} value={process.id}>
                    {process.code} - {process.name}
                  </option>
                ))
              : !processesLoading && (
                  <option value="" disabled>
                    공정 데이터가 없습니다
                  </option>
                )}
          </select>
          {errors.processId && <p className="mt-1 text-sm text-red-600">{errors.processId}</p>}
        </div>

        {/* OK 수량 입력 */}
        <div>
          <label htmlFor="okQuantity" className="block text-sm font-medium text-gray-700 mb-2">
            OK 수량 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="okQuantity"
            name="okQuantity"
            value={formData.okQuantity}
            onChange={handleChange}
            min="0"
            step="1"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
              errors.okQuantity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="OK 수량을 입력하세요"
          />
          {errors.okQuantity && <p className="mt-1 text-sm text-red-600">{errors.okQuantity}</p>}
        </div>

        {/* NG 수량 입력 */}
        <div>
          <label htmlFor="ngQuantity" className="block text-sm font-medium text-gray-700 mb-2">
            NG 수량 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="ngQuantity"
            name="ngQuantity"
            value={formData.ngQuantity}
            onChange={handleChange}
            min="0"
            step="1"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
              errors.ngQuantity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="NG 수량을 입력하세요"
          />
          {errors.ngQuantity && <p className="mt-1 text-sm text-red-600">{errors.ngQuantity}</p>}
        </div>

        {/* 총 수량 자동 계산 표시 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">총 수량</label>
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
            {calculatedValues.totalQuantity.toLocaleString()}개
          </div>
          <p className="mt-1 text-xs text-gray-500">OK 수량 + NG 수량 (자동 계산)</p>
        </div>

        {/* NG 비율 자동 계산 표시 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NG 비율</label>
          <div
            className={`w-full px-4 py-2 border rounded-lg ${
              calculatedValues.isExceedingThreshold
                ? 'bg-slate-50 border-l-4 border-slate-400 border-l-4 text-gray-900'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            {calculatedValues.ngRate}%
          </div>
          {calculatedValues.isExceedingThreshold && (
            <p className="mt-1 text-xs text-yellow-600">⚠ 업계 평균(0.5%) 초과</p>
          )}
          <p className="mt-1 text-xs text-gray-500">NG 수량 / 총 수량 × 100 (자동 계산)</p>
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

export default QualityRecordForm
