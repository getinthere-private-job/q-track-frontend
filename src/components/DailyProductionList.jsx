import { useState, useEffect } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ko } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import { useDailyProductions, useDeleteDailyProduction } from '../hooks/useDailyProductions'
import { useItems } from '../hooks/useItems'
import useUserStore from '../stores/userStore'

// 한국어 로케일 등록
registerLocale('ko', ko)

const DailyProductionList = () => {
  const user = useUserStore((state) => state.user)
  const [selectedItemId, setSelectedItemId] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Date 객체를 yyyy-MM-dd 형식으로 변환
  const formatDate = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(0)
  }, [selectedItemId, startDate, endDate])

  // 서버에 필터 조건과 페이징 파라미터 전달
  const queryParams = {
    page: currentPage,
    size: pageSize,
    ...(selectedItemId && { itemId: parseInt(selectedItemId) }),
    ...(startDate && { startDate: formatDate(startDate) }),
    ...(endDate && { endDate: formatDate(endDate) }),
  }

  const { data: pageData, isLoading, error } = useDailyProductions(queryParams)
  const { data: items } = useItems()
  const deleteMutation = useDeleteDailyProduction()

  // Page 객체에서 데이터 추출 (서버에서 이미 필터링되고 페이징된 데이터)
  const dailyProductions = pageData?.content || []
  const totalElements = pageData?.totalElements || 0
  const totalPages = pageData?.totalPages || 0

  // 필터 변경 핸들러
  const handleFilterChange = () => {
    // useEffect에서 currentPage가 0으로 리셋됨
  }

  // 페이지 변경 핸들러
  const handlePageChange = (newPage, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    // 스크롤 위치 저장
    const scrollPosition = window.scrollY || window.pageYOffset
    setCurrentPage(newPage)
    // 다음 프레임에서 스크롤 위치 복원
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition)
    })
  }

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (newSize, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    // 스크롤 위치 저장
    const scrollPosition = window.scrollY || window.pageYOffset
    setPageSize(parseInt(newSize))
    setCurrentPage(0)
    // 다음 프레임에서 스크롤 위치 복원
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition)
    })
  }

  // 부품명 찾기 헬퍼
  const getItemName = (itemId) => {
    const item = items?.find((i) => i.id === itemId)
    return item ? `${item.code} - ${item.name}` : itemId
  }

  // 권한 확인
  const canDelete = user && (user.role === 'MANAGER' || user.role === 'ADMIN')

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-sm text-gray-600">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-sm text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">일별 생산 데이터 목록</h2>

      {/* 필터 */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 부품 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">부품 필터</label>
            <select
              value={selectedItemId}
              onChange={(e) => {
                setSelectedItemId(e.target.value)
                handleFilterChange()
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="">전체</option>
              {items &&
                items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} - {item.name}
                  </option>
                ))}
            </select>
          </div>

          {/* 시작 날짜 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작 날짜</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date)
                handleFilterChange()
              }}
              locale="ko"
              dateFormat="yyyy-MM-dd"
              placeholderText="시작 날짜 선택"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              wrapperClassName="w-full"
              calendarClassName="!scale-125"
              popperClassName="z-50"
            />
          </div>

          {/* 종료 날짜 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">종료 날짜</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date)
                handleFilterChange()
              }}
              locale="ko"
              dateFormat="yyyy-MM-dd"
              placeholderText="종료 날짜 선택"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              wrapperClassName="w-full"
              calendarClassName="!scale-125"
              popperClassName="z-50"
            />
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                생산일
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                부품 코드
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                부품명
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                총 생산량
              </th>
              {canDelete && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                  액션
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {dailyProductions && dailyProductions.length > 0 ? (
              dailyProductions.map((item) => {
                const itemData = items?.find((i) => i.id === item.itemId)
                const itemCode = itemData ? itemData.code : '-'
                const itemName = itemData ? itemData.name : '-'

                return (
                  <tr key={item.id} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.productionDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {itemCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {itemName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.totalQuantity.toLocaleString()}
                    </td>
                  {canDelete && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        삭제
                      </button>
                    </td>
                  )}
                </tr>
                )
              })
            ) : (
                <tr>
                  <td
                    colSpan={canDelete ? 5 : 4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 컨트롤 */}
      {totalPages > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">페이지당 항목 수:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value, e)}
              className="px-3 py-1 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              총 {totalElements.toLocaleString()}개 중 {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements).toLocaleString()}개
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => handlePageChange(0, e)}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              처음
            </button>
            <button
              type="button"
              onClick={(e) => handlePageChange(currentPage - 1, e)}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>

            {/* 페이지 번호 버튼 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i
              } else if (currentPage < 2) {
                pageNum = i
              } else if (currentPage > totalPages - 3) {
                pageNum = totalPages - 5 + i
              } else {
                pageNum = currentPage - 2 + i
              }

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={(e) => handlePageChange(pageNum, e)}
                    className={`px-3 py-1 text-sm border border-gray-300 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                )
            })}

            <button
              type="button"
              onClick={(e) => handlePageChange(currentPage + 1, e)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
            <button
              type="button"
              onClick={(e) => handlePageChange(totalPages - 1, e)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              마지막
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyProductionList
