import { useState, useMemo } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ko } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import { useQualityRecords, useDeleteQualityRecord } from '../hooks/useQualityRecords'
import { useProcesses } from '../hooks/useProcesses'
import { useItems } from '../hooks/useItems'
import { useDailyProductions } from '../hooks/useDailyProductions'
import { useSystemCodes } from '../hooks/useSystemCodes'
import useUserStore from '../stores/userStore'
import QualityRecordEvaluateModal from './modals/QualityRecordEvaluateModal'

// 한국어 로케일 등록
registerLocale('ko', ko)

const QualityRecordList = () => {
  const user = useUserStore((state) => state.user)
  const [showEvaluationOnly, setShowEvaluationOnly] = useState(false)
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('desc')
  const [evaluatingRecordId, setEvaluatingRecordId] = useState(null)

  // 필터 상태
  const [selectedItemId, setSelectedItemId] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('')

  const { data: qualityRecords, isLoading, error } = useQualityRecords()
  const { data: processes } = useProcesses()
  const { data: items } = useItems()
  const { data: dailyProductions } = useDailyProductions()
  const { data: systemCodes } = useSystemCodes()
  const deleteMutation = useDeleteQualityRecord()

  // 업계 평균 임계값 조회
  const industryAverageThreshold = useMemo(() => {
    const code = systemCodes?.find(
      (c) => c.codeGroup === 'INDUSTRY_AVERAGE' && c.codeKey === 'NG_RATE_THRESHOLD'
    )
    return code ? parseFloat(code.codeValue) : 0.5 // 기본값 0.5%
  }, [systemCodes])

  // 부품명 찾기 헬퍼
  const getItemName = (itemId) => {
    const item = items?.find((i) => i.id === itemId)
    return item ? `${item.code} - ${item.name}` : itemId
  }

  // 공정명 찾기 헬퍼
  const getProcessName = (processId) => {
    const process = processes?.find((p) => p.id === processId)
    return process ? `${process.code} - ${process.name}` : processId
  }

  // 공정 순서 찾기 헬퍼
  const getProcessSequence = (processId) => {
    const process = processes?.find((p) => p.id === processId)
    return process ? (process.sequence || 999) : 999 // sequence가 없으면 맨 뒤로
  }

  // 일별 생산 데이터 찾기 헬퍼
  const getDailyProduction = (dailyProductionId) => {
    return dailyProductions?.find((dp) => dp.id === dailyProductionId) || null
  }

  // NG 비율 계산
  const calculateNgRate = (record) => {
    const total = record.okQuantity + record.ngQuantity
    return total > 0 ? ((record.ngQuantity / total) * 100).toFixed(2) : '0.00'
  }

  // Date 객체를 yyyy-MM-dd 형식으로 변환
  const formatDate = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 년-월 형식으로 변환 (yyyy-MM)
  const formatYearMonth = (dateString) => {
    if (!dateString) return ''
    return dateString.substring(0, 7) // "2025-01-15" → "2025-01"
  }

  // 필터링 및 정렬
  const filteredAndSortedData = useMemo(() => {
    let filtered = qualityRecords || []

    // 평가 필요 항목만 필터링
    if (showEvaluationOnly) {
      filtered = filtered.filter((record) => record.evaluationRequired)
    }

    // 일별 생산 데이터 기반 필터링
    filtered = filtered.filter((record) => {
      const dailyProduction = getDailyProduction(record.dailyProductionId)
      if (!dailyProduction) return false

      const productionDate = dailyProduction.productionDate
      const itemId = dailyProduction.itemId

      // 아이템별 필터
      if (selectedItemId && itemId !== parseInt(selectedItemId)) {
        return false
      }

      // 일별 필터 (시작일)
      if (startDate) {
        const itemDate = new Date(productionDate)
        const start = new Date(formatDate(startDate))
        start.setHours(0, 0, 0, 0)
        if (itemDate < start) {
          return false
        }
      }

      // 일별 필터 (종료일)
      if (endDate) {
        const itemDate = new Date(productionDate)
        const end = new Date(formatDate(endDate))
        end.setHours(23, 59, 59, 999)
        if (itemDate > end) {
          return false
        }
      }

      // 월별 필터
      if (selectedMonth) {
        const recordMonth = formatYearMonth(productionDate)
        if (recordMonth !== selectedMonth) {
          return false
        }
      }

      return true
    })

    // 정렬 (날짜별, 부품코드별 우선 정렬)
    filtered = [...filtered].sort((a, b) => {
      // 사용자 지정 정렬이 있으면 해당 정렬 적용
      if (sortColumn) {
        let aValue = a[sortColumn]
        let bValue = b[sortColumn]

        if (sortColumn === 'ngRate') {
          aValue = parseFloat(calculateNgRate(a))
          bValue = parseFloat(calculateNgRate(b))
        } else if (sortColumn === 'evaluationRequired') {
          aValue = a.evaluationRequired ? 1 : 0
          bValue = b.evaluationRequired ? 1 : 0
        }

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      }

      // 기본 정렬: 날짜별 → 부품코드별
      const dailyProductionA = getDailyProduction(a.dailyProductionId)
      const dailyProductionB = getDailyProduction(b.dailyProductionId)

      const dateA = dailyProductionA ? dailyProductionA.productionDate : ''
      const dateB = dailyProductionB ? dailyProductionB.productionDate : ''

      // 날짜 비교
      if (dateA !== dateB) {
        return dateA > dateB ? 1 : -1
      }

      // 날짜가 같으면 부품코드 비교
      const itemA = dailyProductionA && items ? items.find((i) => i.id === dailyProductionA.itemId) : null
      const itemB = dailyProductionB && items ? items.find((i) => i.id === dailyProductionB.itemId) : null

      const codeA = itemA ? itemA.code : ''
      const codeB = itemB ? itemB.code : ''

      if (codeA !== codeB) {
        return codeA > codeB ? 1 : -1
      }

      // 날짜와 부품코드가 같으면 공정 순서로 정렬 (W → P → 검)
      const sequenceA = getProcessSequence(a.processId)
      const sequenceB = getProcessSequence(b.processId)

      if (sequenceA !== sequenceB) {
        return sequenceA > sequenceB ? 1 : -1
      }

      return 0
    })

    return filtered
  }, [qualityRecords, showEvaluationOnly, sortColumn, sortDirection, processes, items, dailyProductions, selectedItemId, startDate, endDate, selectedMonth])

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  // 권한 확인
  const canEvaluate = user && (user.role === 'MANAGER' || user.role === 'ADMIN')
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
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">품질 기록 목록</h2>
          {/* 평가 필요만 보기 필터 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEvaluationOnly}
              onChange={(e) => setShowEvaluationOnly(e.target.checked)}
              className="w-4 h-4 text-slate-800 border-gray-300 rounded focus:ring-slate-500"
            />
            <span className="text-sm text-gray-700">평가 필요만 보기</span>
          </label>
        </div>

        {/* 평가 필요 항목 기준 정보 */}
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">평가 필요 항목 기준</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="font-medium">1.</span>
              <div>
                <span className="font-medium">자동차 부품 업계 평균 임계값: </span>
                <span className="text-slate-800 font-semibold">{industryAverageThreshold}%</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">2.</span>
              <div>
                <span className="font-medium">평가 필요 조건:</span>
                <ul className="mt-1 ml-4 list-disc space-y-1 text-gray-600">
                  <li>NG 비율이 자동차 부품 업계 평균 임계값 초과 시</li>
                  <li>전일 대비 NG 비율이 2배 이상 증가 시</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 부품 코드 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">부품 코드</label>
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

            {/* 시작 날짜 (일별 필터) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">시작 날짜</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date)
                  setSelectedMonth('') // 일별 필터 선택 시 월별 필터 초기화
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

            {/* 종료 날짜 (일별 필터) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">종료 날짜</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date)
                  setSelectedMonth('') // 일별 필터 선택 시 월별 필터 초기화
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

            {/* 월별 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">월별 조회</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value)
                  setStartDate(null) // 월별 필터 선택 시 일별 필터 초기화
                  setEndDate(null)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500"
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  공정
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                  OK 수량
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                  NG 수량
                </th>
                <th
                  className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('ngRate')}
                >
                  NG 비율
                  {sortColumn === 'ngRate' && (
                    <span className="ml-1 text-slate-800">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('evaluationRequired')}
                >
                  평가 필요
                  {sortColumn === 'evaluationRequired' && (
                    <span className="ml-1 text-slate-800">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                {(canEvaluate || canDelete) && (
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                    액션
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData && filteredAndSortedData.length > 0 ? (
                filteredAndSortedData.map((record, index) => {
                  const ngRate = calculateNgRate(record)
                  const isExceedingThreshold = parseFloat(ngRate) > 0.5
                  const dailyProduction = getDailyProduction(record.dailyProductionId)
                  const productionDate = dailyProduction ? dailyProduction.productionDate : '-'
                  const item = dailyProduction && items ? items.find((i) => i.id === dailyProduction.itemId) : null
                  const itemCode = item ? item.code : '-'
                  const itemName = item ? item.name : '-'

                  // 같은 생산일+부품코드 그룹 확인
                  const prevRecord = index > 0 ? filteredAndSortedData[index - 1] : null
                  const nextRecord = index < filteredAndSortedData.length - 1 ? filteredAndSortedData[index + 1] : null

                  const prevDailyProduction = prevRecord ? getDailyProduction(prevRecord.dailyProductionId) : null
                  const nextDailyProduction = nextRecord ? getDailyProduction(nextRecord.dailyProductionId) : null

                  const prevDate = prevDailyProduction ? prevDailyProduction.productionDate : null
                  const prevItem = prevDailyProduction && items ? items.find((i) => i.id === prevDailyProduction.itemId) : null
                  const prevItemCode = prevItem ? prevItem.code : null

                  const nextDate = nextDailyProduction ? nextDailyProduction.productionDate : null
                  const nextItem = nextDailyProduction && items ? items.find((i) => i.id === nextDailyProduction.itemId) : null
                  const nextItemCode = nextItem ? nextItem.code : null

                  // 그룹의 첫 번째/마지막 행인지 확인
                  const isGroupStart = !prevRecord || prevDate !== productionDate || prevItemCode !== itemCode
                  const isGroupEnd = !nextRecord || nextDate !== productionDate || nextItemCode !== itemCode

                  // 그룹 테두리 클래스
                  const groupBorderClass = isGroupStart && isGroupEnd
                    ? 'border-2 border-gray-300' // 단독 행
                    : isGroupStart
                    ? 'border-t-2 border-l-2 border-r-2 border-gray-300' // 그룹 시작
                    : isGroupEnd
                    ? 'border-b-2 border-l-2 border-r-2 border-gray-300' // 그룹 끝
                    : 'border-l-2 border-r-2 border-gray-300' // 그룹 중간

                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-gray-50 ${groupBorderClass} ${
                        record.evaluationRequired ? 'bg-slate-50 border-l-4 border-l-slate-400' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {productionDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {itemCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {itemName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {getProcessName(record.processId)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {record.okQuantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {record.ngQuantity.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right ${
                          isExceedingThreshold ? 'text-red-600 font-semibold' : 'text-gray-900'
                        }`}
                      >
                        {ngRate}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {record.evaluationRequired ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-slate-50 text-slate-800 border border-slate-400">
                            평가 필요
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      {(canEvaluate || canDelete) && (
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            {canEvaluate && record.evaluationRequired && (
                              <button
                                onClick={() => setEvaluatingRecordId(record.id)}
                                className="px-3 py-1 text-xs bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                              >
                                평가
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => deleteMutation.mutate(record.id)}
                                disabled={deleteMutation.isPending}
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                삭제
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={canEvaluate || canDelete ? 9 : 8}
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

      {/* 평가 모달 */}
      {evaluatingRecordId && (
        <QualityRecordEvaluateModal
          recordId={evaluatingRecordId}
          onClose={() => setEvaluatingRecordId(null)}
        />
      )}
    </>
  )
}

export default QualityRecordList
