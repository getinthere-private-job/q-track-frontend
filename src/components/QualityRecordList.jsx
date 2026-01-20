import { useState, useEffect } from 'react'
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
  const [evaluatingRecordId, setEvaluatingRecordId] = useState(null)

  // 필터 상태
  const [selectedItemId, setSelectedItemId] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(0)
  }, [selectedItemId, startDate, endDate, selectedMonth, showEvaluationOnly])

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

  // 서버에 필터 조건과 페이징 파라미터 전달
  const queryParams = {
    page: currentPage,
    size: pageSize,
    ...(selectedItemId && { itemId: parseInt(selectedItemId) }),
    ...(startDate && { startDate: formatDate(startDate) }),
    ...(endDate && { endDate: formatDate(endDate) }),
    ...(selectedMonth && {
      year: parseInt(selectedMonth.substring(0, 4)),
      month: parseInt(selectedMonth.substring(5, 7)),
    }),
  }

  const { data: pageData, isLoading, error } = useQualityRecords(queryParams)
  const { data: processes } = useProcesses()
  const { data: items } = useItems()
  const { data: systemCodes } = useSystemCodes()
  const deleteMutation = useDeleteQualityRecord()

  // Page 객체에서 데이터 추출 (서버에서 이미 필터링되고 페이징된 데이터)
  const qualityRecords = pageData?.content || []
  const totalElements = pageData?.totalElements || 0
  const totalPages = pageData?.totalPages || 0

  // 필터 변경 핸들러
  const handleFilterChange = () => {
    // useEffect에서 currentPage가 0으로 리셋됨
  }

  // 업계 평균 임계값 조회
  const industryAverageThreshold = systemCodes?.find(
    (c) => c.codeGroup === 'INDUSTRY_AVERAGE' && c.codeKey === 'NG_RATE_THRESHOLD'
  ) ? parseFloat(systemCodes.find((c) => c.codeGroup === 'INDUSTRY_AVERAGE' && c.codeKey === 'NG_RATE_THRESHOLD').codeValue) : 0.5

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

  // NG 비율 계산
  const calculateNgRate = (record) => {
    const total = record.okQuantity + record.ngQuantity
    return total > 0 ? ((record.ngQuantity / total) * 100).toFixed(2) : '0.00'
  }

  // 평가 필요 항목만 필터링 (클라이언트 사이드 - 서버에서 지원하지 않으므로)
  // 참고: 평가 필요 필터링은 서버에서 지원하지 않으므로 클라이언트에서만 처리
  const filteredData = showEvaluationOnly
    ? qualityRecords.filter((record) => record.evaluationRequired)
    : qualityRecords

  // 정렬 기능 제거 - 서버 정렬 순서 유지
  // const handleSort = (column) => {
  //   if (sortColumn === column) {
  //     setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  //   } else {
  //     setSortColumn(column)
  //     setSortDirection('desc')
  //   }
  // }

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
              onChange={(e) => {
                setShowEvaluationOnly(e.target.checked)
                handleFilterChange()
              }}
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

            {/* 시작 날짜 (일별 필터) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">시작 날짜</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date)
                  setSelectedMonth('') // 일별 필터 선택 시 월별 필터 초기화
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

            {/* 종료 날짜 (일별 필터) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">종료 날짜</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date)
                  setSelectedMonth('') // 일별 필터 선택 시 월별 필터 초기화
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
                  handleFilterChange()
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
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                  NG 비율
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  평가 필요
                </th>
                {(canEvaluate || canDelete) && (
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                    액션
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((record, index) => {
                  const ngRate = calculateNgRate(record)
                  const isExceedingThreshold = parseFloat(ngRate) > 0.5
                  
                  // record에서 직접 정보 가져오기 (서버에서 이미 조인된 데이터)
                  const productionDate = record.productionDate || '-'
                  const item = items ? items.find((i) => i.id === record.itemId) : null
                  const itemCode = item ? item.code : '-'
                  const itemName = item ? item.name : '-'
                  
                  // 같은 생산일+부품코드 그룹 확인
                  const prevRecord = index > 0 ? filteredData[index - 1] : null
                  const nextRecord = index < filteredData.length - 1 ? filteredData[index + 1] : null

                  const prevDate = prevRecord ? prevRecord.productionDate : null
                  const prevItem = prevRecord && items ? items.find((i) => i.id === prevRecord.itemId) : null
                  const prevItemCode = prevItem ? prevItem.code : null

                  const nextDate = nextRecord ? nextRecord.productionDate : null
                  const nextItem = nextRecord && items ? items.find((i) => i.id === nextRecord.itemId) : null
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
                      className={`hover:bg-gray-50 ${groupBorderClass} ${record.evaluationRequired ? 'bg-slate-50 border-l-4 border-l-slate-400' : ''
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
                        className={`px-4 py-3 text-sm text-right ${isExceedingThreshold ? 'text-red-600 font-semibold' : 'text-gray-900'
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
                    className={`px-3 py-1 text-sm border border-gray-300 rounded-lg transition-colors ${currentPage === pageNum
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
