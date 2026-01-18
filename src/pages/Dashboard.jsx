import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import ProcessNgRateChart from '../components/charts/ProcessNgRateChart'
import ItemNgRateChart from '../components/charts/ItemNgRateChart'
import StatisticsTable from '../components/StatisticsTable'
import { useStatisticsByItem } from '../hooks/useStatistics'

const Dashboard = () => {
  const [filterMode, setFilterMode] = useState('all') // 'all', 'year', 'month'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1) // 1-12

  // 필터 모드에 따라 날짜 범위 계산
  const { startDate, endDate } = useMemo(() => {
    if (filterMode === 'year') {
      // 년도별: 해당 년도의 1월 1일 ~ 12월 31일
      const start = new Date(selectedYear, 0, 1) // 1월 1일
      const end = new Date(selectedYear, 11, 31) // 12월 31일
      return { startDate: start, endDate: end }
    } else if (filterMode === 'month') {
      // 월별: 해당 월의 1일 ~ 마지막 일
      const start = new Date(selectedYear, selectedMonth - 1, 1) // 월의 1일
      const lastDay = new Date(selectedYear, selectedMonth, 0).getDate() // 월의 마지막 일
      const end = new Date(selectedYear, selectedMonth - 1, lastDay) // 월의 마지막 일
      return { startDate: start, endDate: end }
    } else {
      // 전체: 날짜 범위 없음
      return { startDate: null, endDate: null }
    }
  }, [filterMode, selectedYear, selectedMonth])

  // 날짜 범위 파라미터 구성
  const params = useMemo(() => {
    const p = {}
    if (startDate) {
      const year = startDate.getFullYear()
      const month = String(startDate.getMonth() + 1).padStart(2, '0')
      const day = String(startDate.getDate()).padStart(2, '0')
      p.startDate = `${year}-${month}-${day}`
    }
    if (endDate) {
      const year = endDate.getFullYear()
      const month = String(endDate.getMonth() + 1).padStart(2, '0')
      const day = String(endDate.getDate()).padStart(2, '0')
      p.endDate = `${year}-${month}-${day}`
    }
    return p
  }, [startDate, endDate])

  // 통계 데이터 조회 (KPI 카드 계산용)
  const { data: itemStats } = useStatisticsByItem(params)

  // KPI 계산
  const kpiData = useMemo(() => {
    if (!itemStats || itemStats.length === 0) {
      return {
        totalQuantity: 0,
        totalNgQuantity: 0,
        ngRate: 0
      }
    }

    const totalQuantity = itemStats.reduce((sum, stat) => sum + (stat.totalQuantity || 0), 0)
    const totalNgQuantity = itemStats.reduce((sum, stat) => sum + (stat.totalNgQuantity || 0), 0)
    const ngRate = totalQuantity > 0 ? (totalNgQuantity / totalQuantity) * 100 : 0

    return {
      totalQuantity,
      totalNgQuantity,
      ngRate: ngRate.toFixed(2)
    }
  }, [itemStats])

  return (
    <Layout title="대시보드">
      {/* KPI 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="총 생산량" value={kpiData.totalQuantity.toLocaleString()} unit="개" />
        <StatCard title="총 NG 수량" value={kpiData.totalNgQuantity.toLocaleString()} unit="개" isNg />
        <StatCard title="NG 비율" value={kpiData.ngRate} unit="%" isNg />
        <StatCard title="업계 평균 임계값" value="0.5" unit="%" />
      </div>

      {/* 그래프 필터 영역 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700">기간 필터:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white shadow-md border-2 border-slate-800'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-slate-50'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilterMode('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterMode === 'year'
                  ? 'bg-slate-800 text-white shadow-md border-2 border-slate-800'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-slate-50'
              }`}
            >
              년도별
            </button>
            <button
              onClick={() => setFilterMode('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterMode === 'month'
                  ? 'bg-slate-800 text-white shadow-md border-2 border-slate-800'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-slate-50'
              }`}
            >
              월별
            </button>
          </div>

          {/* 년도 선택 (년도별, 월별 모드일 때 표시) */}
          {(filterMode === 'year' || filterMode === 'month') && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">년도:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i
                  return (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          {/* 월 선택 (월별 모드일 때만 표시) */}
          {filterMode === 'month' && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">월:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const month = i + 1
                  return (
                    <option key={month} value={month}>
                      {month}월
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          {/* 현재 필터 상태 표시 */}
          {filterMode !== 'all' && (
            <div className="text-sm text-gray-500 ml-auto">
              {filterMode === 'year' && `${selectedYear}년 전체`}
              {filterMode === 'month' && `${selectedYear}년 ${selectedMonth}월`}
            </div>
          )}
        </div>
      </div>

      {/* 그래프 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProcessNgRateChart startDate={startDate} endDate={endDate} />
        <ItemNgRateChart startDate={startDate} endDate={endDate} />
      </div>

      {/* 통계 테이블 영역 */}
      <div className="space-y-6">
        <StatisticsTable type="process" />
        <StatisticsTable type="item" />
      </div>
    </Layout>
  )
}

export default Dashboard
