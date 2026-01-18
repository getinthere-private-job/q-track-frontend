import { useState } from 'react'
import { useEvaluateQualityRecord } from '../../hooks/useQualityRecords'

const QualityRecordEvaluateModal = ({ recordId, onClose }) => {
  const [evaluation, setEvaluation] = useState('')
  const [errors, setErrors] = useState({})
  const evaluateMutation = useEvaluateQualityRecord()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!evaluation.trim()) {
      setErrors({ evaluation: '평가 내용을 입력하세요' })
      return
    }

    try {
      await evaluateMutation.mutateAsync({
        id: recordId,
        data: { expertEvaluation: evaluation.trim() }
      })
      onClose()
    } catch (error) {
      if (error.response?.data?.msg) {
        setErrors({ submit: error.response.data.msg })
      } else {
        setErrors({ submit: '평가 저장에 실패했습니다. 다시 시도해주세요.' })
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">품질 기록 평가</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* 에러 메시지 */}
          {errors.submit && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* 평가 내용 입력 */}
          <div className="mb-6">
            <label htmlFor="evaluation" className="block text-sm font-medium text-gray-700 mb-2">
              평가 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="evaluation"
              value={evaluation}
              onChange={(e) => {
                setEvaluation(e.target.value)
                if (errors.evaluation) {
                  setErrors((prev) => ({ ...prev, evaluation: '' }))
                }
              }}
              rows={6}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none ${
                errors.evaluation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="평가 내용을 입력하세요"
            />
            {errors.evaluation && (
              <p className="mt-1 text-sm text-red-600">{errors.evaluation}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={evaluateMutation.isPending}
              className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {evaluateMutation.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QualityRecordEvaluateModal
