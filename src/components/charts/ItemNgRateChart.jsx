import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useStatisticsByItem } from '../../hooks/useStatistics'
import { useSystemCodes } from '../../hooks/useSystemCodes'

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
)

const ItemNgRateChart = ({ startDate, endDate }) => {
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

  const { data: statistics, isLoading, error } = useStatisticsByItem(params)
  const { data: systemCodes } = useSystemCodes()

  // 업계 평균 임계값 조회
  const industryAverageThreshold = useMemo(() => {
    const code = systemCodes?.find(
      (c) => c.codeGroup === 'INDUSTRY_AVERAGE' && c.codeKey === 'NG_RATE_THRESHOLD'
    )
    return code ? parseFloat(code.codeValue) : 0.5
  }, [systemCodes])

  // 차트 데이터 준비 (최대 24개 부품)
  const chartData = useMemo(() => {
    if (!statistics || statistics.length === 0) {
      return {
        labels: [],
        datasets: []
      }
    }

    // NG 비율 기준 내림차순 정렬 (높은 순서대로)
    const sortedStats = [...statistics].sort(
      (a, b) => parseFloat(b.ngRate || 0) - parseFloat(a.ngRate || 0)
    )

    const labels = sortedStats.map((stat) => stat.itemCode)
    const ngRates = sortedStats.map((stat) => parseFloat(stat.ngRate || 0))
    const isExceedingThreshold = ngRates.map((rate) => rate > industryAverageThreshold)

    return {
      labels,
      datasets: [
        {
          label: 'NG 비율 (%)',
          data: ngRates,
          backgroundColor: ngRates.map((_, index) =>
            isExceedingThreshold[index]
              ? 'rgba(220, 38, 38, 0.8)' // red-600
              : 'rgba(51, 65, 85, 0.8)' // slate-700
          ),
          borderColor: ngRates.map((_, index) =>
            isExceedingThreshold[index]
              ? 'rgba(220, 38, 38, 1)' // red-600
              : 'rgba(51, 65, 85, 1)' // slate-700
          ),
          borderWidth: 1
        }
      ]
    }
  }, [statistics, industryAverageThreshold])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const item = statistics?.find((s) => s.itemCode === context.label)
            const itemName = item ? item.itemName : ''
            return `${context.label} - ${itemName}: ${context.parsed.y.toFixed(2)}%`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'NG 비율 (%)'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)' // gray-200
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-80 flex items-center justify-center">
        <p className="text-sm text-gray-600">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-80 flex items-center justify-center">
        <p className="text-sm text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500 mb-4">부품별 NG 비율</h3>
      <div className="h-80">
        {chartData.labels.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">데이터가 없습니다.</p>
          </div>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        업계 평균 임계값: <span className="font-semibold">{industryAverageThreshold}%</span>
      </div>
    </div>
  )
}

export default ItemNgRateChart
