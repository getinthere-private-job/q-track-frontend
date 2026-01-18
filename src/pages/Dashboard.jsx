import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import ProcessNgRateChart from '../components/charts/ProcessNgRateChart'
import ItemNgRateChart from '../components/charts/ItemNgRateChart'
import StatisticsTable from '../components/StatisticsTable'
import { useStatisticsByItem } from '../hooks/useStatistics'

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

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
