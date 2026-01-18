import { useState, useMemo } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ko } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import { useStatisticsByProcess, useStatisticsByItem } from '../hooks/useStatistics'
import { useSystemCodes } from '../hooks/useSystemCodes'

// 한국어 로케일 등록
registerLocale('ko', ko)

const StatisticsTable = ({ type = 'process' }) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('desc')

  // Date 객체를 yyyy-MM-dd 형식으로 변환
  const formatDate = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 쿼리 파라미터 구성
  const params = useMemo(() => {
    const p = {}
    if (startDate) p.startDate = formatDate(startDate)
    if (endDate) p.endDate = formatDate(endDate)
    return p
  }, [startDate, endDate])

  const {
    data: processStats,
    isLoading: processLoading,
    error: processError
  } = useStatisticsByProcess(type === 'process' ? params : {})
  const {
    data: itemStats,
    isLoading: itemLoading,
    error: itemError
  } = useStatisticsByItem(type === 'item' ? params : {})

  const { data: systemCodes } = useSystemCodes()

  // 업계 평균 임계값 조회
  const industryAverageThreshold = useMemo(() => {
    const code = systemCodes?.find(
      (c) => c.codeGroup === 'INDUSTRY_AVERAGE' && c.codeKey === 'NG_RATE_THRESHOLD'
    )
    return code ? parseFloat(code.codeValue) : 0.5 // 기본값 0.5%
  }, [systemCodes])

  const isLoading = type === 'process' ? processLoading : itemLoading
  const error = type === 'process' ? processError : itemError
  const statistics = type === 'process' ? processStats : itemStats

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  // 정렬 적용
  const sortedData = useMemo(() => {
    if (!statistics) return []

    const sorted = [...statistics].sort((a, b) => {
      let aValue = a[sortColumn]
      let bValue = b[sortColumn]

      if (sortColumn === 'ngRate') {
        aValue = parseFloat(a.ngRate || 0)
        bValue = parseFloat(b.ngRate || 0)
      } else if (sortColumn === 'totalNgQuantity') {
        aValue = a.totalNgQuantity || 0
        bValue = b.totalNgQuantity || 0
      } else if (sortColumn === 'totalQuantity') {
        aValue = a.totalQuantity || 0
        bValue = b.totalQuantity || 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return sorted
  }, [statistics, sortColumn, sortDirection])

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {type === 'process' ? '공정별 NG 비율 통계' : '부품별 NG 비율 통계'}
        </h2>
      </div>

      {/* 날짜 범위 필터 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* 업계 평균 표시 */}
      <div className="mb-4 text-sm text-gray-600">
        업계 평균 임계값: <span className="font-semibold text-slate-800">{industryAverageThreshold}%</span>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {type === 'process' ? (
                <>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    공정 코드
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    공정명
                  </th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    부품 코드
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    부품명
                  </th>
                </>
              )}
              <th
                className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalQuantity')}
              >
                총 생산량
                {sortColumn === 'totalQuantity' && (
                  <span className="ml-1 text-slate-800">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalNgQuantity')}
              >
                NG 수량
                {sortColumn === 'totalNgQuantity' && (
                  <span className="ml-1 text-slate-800">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('ngRate')}
              >
                NG 비율
                {sortColumn === 'ngRate' && (
                  <span className="ml-1 text-slate-800">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData && sortedData.length > 0 ? (
              sortedData.map((stat) => {
                const ngRate = parseFloat(stat.ngRate || 0)
                const isExceedingThreshold = ngRate > industryAverageThreshold

                return (
                  <tr key={stat.id || stat[type === 'process' ? 'processId' : 'itemId']} className="hover:bg-gray-50 border-b">
                    {type === 'process' ? (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{stat.processCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{stat.processName}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{stat.itemCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{stat.itemName}</td>
                      </>
                    )}
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {stat.totalQuantity?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {stat.totalNgQuantity?.toLocaleString() || 0}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-right ${
                        isExceedingThreshold ? 'text-red-600 font-semibold' : 'text-gray-900'
                      }`}
                    >
                      {ngRate.toFixed(2)}%
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
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

export default StatisticsTable
