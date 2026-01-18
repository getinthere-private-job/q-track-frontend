import { useProcess } from '../hooks/useProcesses'

const ProcessDetailModal = ({ processId, onClose }) => {
  const { data: process, isLoading, error } = useProcess(processId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">공정 상세 정보</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4">
          {isLoading && (
            <p className="text-sm text-gray-600">로딩 중...</p>
          )}

          {error && (
            <p className="text-sm text-red-600">공정 정보를 불러오는 중 오류가 발생했습니다.</p>
          )}

          {process && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">공정 코드</label>
                <p className="text-sm text-gray-900">{process.code}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">공정 이름</label>
                <p className="text-sm text-gray-900">{process.name}</p>
              </div>

              {process.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                  <p className="text-sm text-gray-600">{process.description}</p>
                </div>
              )}

              {process.sequence !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
                  <p className="text-sm text-gray-900">{process.sequence}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProcessDetailModal
