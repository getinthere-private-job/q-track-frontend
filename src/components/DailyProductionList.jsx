import { useState } from 'react'
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
  const [sortColumn, setSortColumn] = useState('productionDate') // 기본값: 날짜 정렬
  const [sortDirection, setSortDirection] = useState('desc') // 기본값: 내림차순

  // Date 객체를 yyyy-MM-dd 형식으로 변환
  const formatDate = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const { data: dailyProductions, isLoading, error } = useDailyProductions()
  const { data: items } = useItems()
  const deleteMutation = useDeleteDailyProduction()

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  // 필터링 및 정렬 적용
  const filteredAndSortedData = dailyProductions
    ? [...dailyProductions]
        .filter((item) => {
          // 부품 필터
          if (selectedItemId && item.itemId !== parseInt(selectedItemId)) {
            return false
          }

          // 시작 날짜 필터
          if (startDate) {
            const itemDate = new Date(item.productionDate)
            const start = new Date(formatDate(startDate))
            start.setHours(0, 0, 0, 0)
            if (itemDate < start) {
              return false
            }
          }

          // 종료 날짜 필터
          if (endDate) {
            const itemDate = new Date(item.productionDate)
            const end = new Date(formatDate(endDate))
            end.setHours(23, 59, 59, 999)
            if (itemDate > end) {
              return false
            }
          }

          return true
        })
        .sort((a, b) => {
          let aValue = a[sortColumn]
          let bValue = b[sortColumn]

          if (sortColumn === 'productionDate') {
            aValue = new Date(a.productionDate).getTime()
            bValue = new Date(b.productionDate).getTime()
          }

          if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })
    : []

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
              onChange={(e) => setSelectedItemId(e.target.value)}
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
              onChange={(date) => setStartDate(date)}
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
              onChange={(date) => setEndDate(date)}
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
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('productionDate')}
              >
                생산일
                {sortColumn === 'productionDate' && (
                  <span className="ml-1 text-slate-800">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                부품 코드
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                부품명
              </th>
              <th
                className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalQuantity')}
              >
                총 생산량
                {sortColumn === 'totalQuantity' && (
                  <span className="ml-1 text-slate-800">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              {canDelete && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                  액션
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData && filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((item) => {
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
    </div>
  )
}

export default DailyProductionList
